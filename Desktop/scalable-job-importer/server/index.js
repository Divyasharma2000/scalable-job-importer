const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const cors = require("cors");
const connectDB = require("./config/db");
const { Queue } = require("bullmq");
const ImportLog = require("./models/ImportLog");
const cron = require("node-cron");

connectDB();

const redisConnection = { host: "127.0.0.1", port: 6379 };
const jobQueue = new Queue("job-queue", { connection: redisConnection });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- API ROUTES ---

app.get("/api/test-fetch", async (req, res) => {
  const API_URL = "https://jobicy.com/?feed=job_feed";

  try {
    console.log(`[API] Fetching data from ${API_URL}...`);
    const response = await axios.get(API_URL);
    const parser = new xml2js.Parser({ explicitArray: false });

    parser.parseString(response.data, async (err, result) => {
      if (err) return res.status(500).json({ message: "XML parse error" });

      let jobs = result.rss.channel.item;
      if (!Array.isArray(jobs)) jobs = [jobs];

      // 1. Database mein shuruwat mein hi entry bana lein
      const newLog = await ImportLog.create({
        fileName: API_URL,
        totalFetched: jobs.length,
        status: "Processing",
      });

      console.log(`[API] Import Log ID created: ${newLog._id}`);

      for (const item of jobs) {
        await jobQueue.add(
          "process-job",
          {
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate,
            importLogId: newLog._id,
          },
          { removeOnComplete: true }
        );
      }

      res.json({ message: `Started! ${jobs.length} jobs queued.` });
    });
  } catch (error) {
    console.error("[API] Fetch Error:", error.message);
    res.status(500).json({ message: "API fetch failed" });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ importDateTime: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

cron.schedule("0 * * * *", async () => {
  try {
    console.log("[CRON]  Starting hourly automatic import...");

    await axios.get(`http://localhost:${PORT}/api/test-fetch`);
    console.log("[CRON]  Auto-import triggered successfully.");
  } catch (error) {
    console.error("[CRON]  Auto-import failed:", error.message);
  }
});

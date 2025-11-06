const { Worker } = require("bullmq");
const connectDB = require("./config/db");
const Job = require("./models/Job");
const ImportLog = require("./models/ImportLog");

connectDB();

const redisConnection = { host: "127.0.0.1", port: 6379 };

console.log("[Worker] Worker process starting...");

const worker = new Worker(
  "job-queue",
  async (job) => {
    if (job.name === "process-job") {
      const { importLogId, link, ...jobData } = job.data;

      try {
        const updateResult = await Job.updateOne(
          { link: link },
          { $set: { link, ...jobData } },
          { upsert: true }
        );

        if (updateResult.upsertedCount > 0) {
          await ImportLog.findByIdAndUpdate(importLogId, {
            $inc: { newJobs: 1 },
          });
        } else {
          await ImportLog.findByIdAndUpdate(importLogId, {
            $inc: { updatedJobs: 1 },
          });
        }
      } catch (err) {
        console.error(`[Worker] Job failed: ${link}`);

        await ImportLog.findByIdAndUpdate(importLogId, {
          $inc: { failedJobs: 1 },
        });
      }
    }
  },
  { connection: redisConnection, concurrency: 5 }
);

worker.on("ready", () => console.log("[Worker] Ready!"));

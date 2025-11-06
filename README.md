# Scalable Job Importer

This is a full-stack MERN application designed to fetch job feeds from external XML APIs, process them using a background queue system, store them in MongoDB, and display import history on a user-friendly dashboard.

## 🚀 Features

* **Automated Job Fetching:** Fetches job data from XML feeds periodically using cron jobs.
* **Queue-Based Processing:** Uses BullMQ and Redis to handle job processing in the background, ensuring scalability.
* **Data Persistence:** Stores job details and granular import logs (Total, New, Updated, Failed) in MongoDB.
* **Real-time Dashboard:** A Next.js frontend that displays live import status and history with auto-refresh.
* **Retry Mechanism:** Failed jobs are automatically retried before being marked as failed.

## 🛠️ Tech Stack

* **Frontend:** Next.js, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Queue:** BullMQ, Redis
* **Scheduler:** node-cron

## ⚙️ Setup & Installation

**Prerequisites:**
* Node.js (v16+)
* MongoDB (Running locally or Atlas URL)
* Redis (Running locally or Cloud URL)

**1. Clone the repository:**
```bash
git clone [https://github.com/YOUR_USERNAME/scalable-job-importer.git](https://github.com/YOUR_USERNAME/scalable-job-importer.git)
cd scalable-job-importer

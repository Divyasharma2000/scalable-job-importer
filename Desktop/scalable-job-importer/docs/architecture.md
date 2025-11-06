# System Architecture

## Overview
The Scalable Job Importer is designed to handle large volumes of job data efficiently by decoupling the data fetching process from the data processing and storage phase. This ensures that the main API remains responsive even during heavy import operations.

## Core Components

### 1. API Server (Producer)
* **Role:** Acts as the entry point for triggering imports (both manual and scheduled via cron).
* **Functionality:**
    * Fetches raw XML data from the external source.
    * Parses XML to JSON.
    * Creates an initial `ImportLog` entry in MongoDB.
    * Pushes each job as an individual task into the Redis queue (BullMQ).

### 2. Redis Queue (Message Broker)
* **Role:** Acts as a buffer between the API server and the worker processes.
* **Benefit:** Allows for asynchronous processing. If the fetch rate is faster than the DB write speed, Redis holds the extra jobs without crashing the server.

### 3. Worker Process (Consumer)
* **Role:** Processes jobs from the queue in the background.
* **Functionality:**
    * Picks up jobs one by one from Redis.
    * Performs an "upsert" operation (insert if new, update if existing) in MongoDB to avoid duplicates.
    * Atomically updates the `ImportLog` counters (New/Updated/Failed) based on the operation result.

### 4. MongoDB (Storage)
* **Collections:**
    * `jobs`: Stores the actual job data with a unique link as the index.
    * `importlogs`: Stores the summary of each import run (start time, counts, status).

### 5. Next.js Dashboard (Frontend)
* **Role:** Provides a visual interface for monitoring.
* **Functionality:** polls the backend API every 5 seconds to fetch the latest `importlogs` and display them in a user-friendly table.

## Architecture Diagram

```mermaid
graph TD
    A[Cron / Manual Trigger] -->|Calls API| B(API Server)
    B -->|Fetches XML| C[External Job Feed]
    B -->|Parses & Queues Jobs| D{Redis Queue}
    D -->|Pulls Jobs| E[Worker Process]
    E -->|Upserts Job| F[(MongoDB - Jobs)]
    E -->|Updates Log| G[(MongoDB - ImportLogs)]
    H[Next.js Dashboard] -->|Polls Status| B
    B -->|Reads Logs| G
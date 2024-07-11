import express from "express";
import cors from "cors";
import { getReviewStatus } from "./services/reviewer";
import { ReviewStatus } from "./types/shared";
import { getRecentCommits } from "./services/github/getCommits";
import { CommitSummary } from "./types/CommitSummary";
const { App, ExpressReceiver } = require("@slack/bolt");

const PORT = process.env.SERVER_PORT || 3000;

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Initialize your Bolt app
const boltApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  // signingSecret: process.env.SLACK_SIGNING_SECRET,
  // Use the expressReceiver to handle incoming HTTP requests
  receiver: expressReceiver,
});

const exApp = express();
exApp.use(express.json());
exApp.use(cors());

// Use Bolt's express middleware to handle Slack events
exApp.use("/slack/events", boltApp.receiver.router);

exApp.get("/express/heartbeat", async (req, res) => {
  const resMessage = "hello world";
  console.log("GET request to /express/heartbeat");
  res.json({ message: resMessage });
});

exApp.post("/express/recent-commits", async (req, res) => {
  console.log("POST request to /express/recent-commits");
  const { owner, repo }: { owner?: string; repo?: string } = req.body;
  try {
    const recentCommits: CommitSummary[] = await getRecentCommits(owner, repo);
    res.json({ commits: recentCommits });
  } catch (error) {
    console.error("Error requesting commits:", error);
    res.status(500).json({ error: "Failed to fetch commits." });
  }
});

exApp.post("/express/full-flow", async (req, res) => {
  console.log("POST request to /express/full-flow");
  const { owner, repo }: { owner?: string; repo?: string } = req.body;
  try {
    const reviewStatus: ReviewStatus = await getReviewStatus(owner, repo);
    const result = {
      reviews: reviewStatus.reviews,
      users: reviewStatus.users,
    };
    res.json(result);
  } catch (error) {
    console.error("Error requesting reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

exApp.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Example of a Bolt event listener
boltApp.event("message", async ({ event, say }) => {
  await say(`You said: ${event.text}`);
});

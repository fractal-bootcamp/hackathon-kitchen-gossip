import express from "express";
import cors from "cors";
import { getReviewStatus } from "./services/reviewer";
import { ReviewStatus } from "./types/shared";
import { getRecentCommits } from "./services/github/getCommits";
import { CommitSummary } from "./types/CommitSummary";
import { generateKitchenGossip } from "./services/slack/bot";
const { App, ExpressReceiver } = require("@slack/bolt");

const PORT = process.env.SERVER_PORT || 3000;
// On Render:
// The default value of PORT is 10000 for all Render web services.
// You can override this value by setting the environment variable
// in the Render Dashboard.

// // LOGGING MIDDLEWARE
// exApp.use((req, res, next) => {
//   console.log("Request Body Length:", req.body.length);
//   console.log("Request URL:", req.url);
//   console.log("Request Method:", req.method);
//   next();
// });

// Initialize an ExpressReceiver
const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const exApp = expressReceiver.app;
exApp.use(express.json());
exApp.use(cors());

const boltApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: false,
  // signingSecret: process.env.SLACK_SIGNING_SECRET,
  // Use the expressReceiver to handle incoming HTTP requests
  endpoints: {
    events: "slack/events",
    commands: "slack/commands",
  },
  receiver: expressReceiver,
});

// Use Bolt's express middleware to handle Slack events
exApp.post("/slack/events", async (req, res, next) => {
  console.log("/slack/events request received");
  if (req.body.type === "url_verification") {
    res.status(200).send(req.body.challenge);
  } else {
    // Pass the request to Bolt's receiver router for other event types
    boltApp.receiver.router(req, res, next);
  }
});

exApp.get("/express/heartbeat", async (req, res) => {
  const resMessage = "hello world 78";
  console.log("GET request to /express/heartbeat");
  res.json({ message: resMessage });
});

// // Example of a Bolt event listener
// boltApp.event("message", async ({ event, say }) => {
//   await say(`You said: ${event.text}`);
// });

// Add a command listener for /whatscooking
boltApp.command("/whatscooking", async ({ command, ack, respond, say }) => {
  await ack();

  try {
    console.log("/whatscooking command received, ack() has happened");
    await respond(`Request received!`);

    // // Send a message to the channel
    // await say({
    //   channel: command.channel_id, // Use the channel ID from the command
    //   text: `<@${command.user_id}> you wanna know what's cooking? Let me go check.`,
    // });

    // Get summary of user reviews
    // This is the master call that triggers all the other sub calls
    console.log("Triggering call to getReviewStatus from router.");
    const reviewStatus: ReviewStatus = await getReviewStatus(
      "fractal-bootcamp",
      "hackathon-kitchen-gossip"
    );

    console.log("reviewStatus received.");

    const gossip = await generateKitchenGossip(reviewStatus.reviews);

    // await say(`## Reviews Status\n${reviewStatus.reviews}`);
    // await say({
    //   channel: "#kitchen-gossip",
    //   text: reviewStatus.reviews,
    // });

    await say({
      channel: "#kitchen-gossip",
      text: "Here's what's cooking:",
      blocks: gossip,
    });
  } catch (error) {
    console.error("Error handling /whatscooking command:", error);
    await respond({
      response_type: "ephemeral",
      text: "There was an error processing your request. Please try again later.",
    });
  }
});

/**
 *
 * EXPRESS ROUTES THAT MAY NOT BE NEEDED FOR THIS APP
 *
 */
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

/**
 *
 * EXPRESS APP LISTEN
 *
 */
exApp.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

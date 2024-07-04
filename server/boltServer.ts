import { App } from "@slack/bolt";
import { getEnv } from "./utils/getEnv";
import { sendMessage } from "./services/slack/sendMessage";
import { ReviewStatus } from "./types/shared";
import { getReviewStatus } from "./services/reviewer";
import { generateKitchenGossip } from "./services/slack/bot";
// import { mount } from "./routes/status"

/**
 * This server is based on Slack Bolt. This library gives us:
 *
 * - A basic web server to run your app on
 * - Authentication and installation handling for all the ins and outs of OAuth
 * - Simplified interfaces for all Slack APIs and app features
 * - Automatic token validation, retry, and rate-limiting logic
 *
 * More info: https://api.slack.com/tutorials/tracks/hello-world-bolt
 *
 * Previously we had Express server. See commented out code here:
 * https://github.com/fractal-bootcamp/hackathon-kitchen-gossip/blob/21990c8cdbea9acdf1c6cf964923e110896fcdd3/server/server.ts#L31-L56
 */
async function init() {
  const port = parseInt(getEnv("PORT"));
  const slackApp = new App({
    token: getEnv("SLACK_BOT_TOKEN"),
    signingSecret: getEnv("SLACK_SIGNING_SECRET"),
    appToken: getEnv("SLACK_APP_TOKEN"),
    socketMode: false, // add this? maybe
    port,
    // receiver: receiver,
  });
  await slackApp.start();

  slackApp.command("/whatscooking", async ({ command, ack, say, respond }) => {
    // Log that command is called
    console.log("/whatscooking", command);

    // Give simple response to Slack user to acknowledge receipt of the command
    await ack();
    await respond("cooking...");

    // Get summary of user reviews
    // This is the master call that triggers all the other sub calls
    const reviewStatus: ReviewStatus = await getReviewStatus();
    // await postText(reviewStatus.reviews)

    const gossip = await generateKitchenGossip(reviewStatus.reviews);

    // await say(`## Reviews Status\n${reviewStatus.reviews}`)
    // await say({
    //   channel: "#kitchen-gossip",
    //   text: reviewStatus.reviews,
    // })
    await say({
      channel: "#kitchen-gossip",
      text: "Here is the latest kitchen gossip!",
      blocks: gossip,
    });
  });

  // mount(receiver.app)

  const currentTime = new Date().toTimeString();
  const msg = `slack app boot at ${currentTime}`;
  await sendMessage(msg);

  // receiver.app.listen(port, () => {
  //   console.log(`Server running on port ${port}`)
  // })
}

init();

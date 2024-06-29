// import express from "express"
// import cors from "cors"
// import { mount } from "./routes/status"
import {
  App,
  // ExpressReceiver
} from "@slack/bolt"
import { getEnv } from "./utils/getEnv"
import { sendMessage } from "./services/slack/sendMessage"

import { ReviewStatus } from "./types/shared"
import { getReviewStatus } from "./services/reviewer"
import { generateKitchenGossip } from "./services/slack/bot"
// const app = express()

async function init() {
  // const receiver = new ExpressReceiver({
  //   signingSecret: getEnv("SLACK_SIGNING_SECRET"),
  // })
  const port = parseInt(getEnv("PORT"))
  const slackApp = new App({
    token: getEnv("SLACK_BOT_TOKEN"),
    signingSecret: getEnv("SLACK_SIGNING_SECRET"),
    appToken: getEnv("SLACK_APP_TOKEN"),
    socketMode: true, // add this
    port,
    // receiver: receiver,
  })
  await slackApp.start()

  // receiver.app.use(express.json())
  // receiver.app.use(cors())

  // slackApp.message("hi", async ({ message, say }) => {
  //   // say() sends a message to the channel where the event was triggered
  //   // <@${message.user}>!
  //   console.log("hi message", message)
  //   await say(`hola! <@${message.user}>!`)
  // })
  // receiver.app.get("/", async (req, res) => {
  //   console.log("GET endpoint called.")
  //   res.json({ message: "Hello from the server" })
  // })

  // comment

  // const storedValues: string[] = []

  // receiver.app.post("/newmessage", async (req, res) => {
  //   console.log("POST endpoint called.")
  //   const newMessage = req.body.message
  //   storedValues.push(newMessage)
  //   res.json({ messages: storedValues })
  // })

  // The echo command simply echoes on command
  slackApp.command("/whatscooking", async ({ command, ack, say, respond }) => {
    console.log("/whatscooking", command)
    await ack()
    await respond("cooking...")
    const reviewStatus: ReviewStatus = await getReviewStatus()
    // await postText(reviewStatus.reviews)

    const gossip = await generateKitchenGossip(reviewStatus.reviews)

    await say(`## Reviews Status\n${reviewStatus.reviews}`)
    await say({
      channel: "#kitchen-gossip",
      // text: "Here is the latest kitchen gossip!",
      text: reviewStatus.reviews,
      blocks: gossip,
    })
  })

  // mount(receiver.app)

  const currentTime = new Date().toTimeString()
  const msg = `slack app boot at ${currentTime}`
  await sendMessage(msg)

  // receiver.app.listen(port, () => {
  //   console.log(`Server running on port ${port}`)
  // })
}

init()

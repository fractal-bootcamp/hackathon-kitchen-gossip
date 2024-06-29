import express from "express"
import cors from "cors"
import { mount } from "./routes/status"
import { App, ExpressReceiver } from "@slack/bolt"
import { getEnv } from "./utils/getEnv"
import { sendMessage } from "./services/slack/sendMessage"

// const app = express()

async function init() {
  const receiver = new ExpressReceiver({
    signingSecret: getEnv("SLACK_SIGNING_SECRET"),
  })
  const port = parseInt(getEnv("PORT"))
  const slackApp = new App({
    token: getEnv("SLACK_BOT_TOKEN"),
    signingSecret: getEnv("SLACK_SIGNING_SECRET"),
    appToken: getEnv("SLACK_APP_TOKEN"),
    port,
    receiver: receiver,
  })
  await slackApp.start()

  // receiver.app.use(express.json())
  // receiver.app.use(cors())

  slackApp.message("hello", async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    // <@${message.user}>!
    console.log("message", message)
    await say(`Hey there `)
  })
  // receiver.app.get("/", async (req, res) => {
  //   console.log("GET endpoint called.")
  //   res.json({ message: "Hello from the server" })
  // })

  // comment

  const storedValues: string[] = []

  receiver.app.post("/newmessage", async (req, res) => {
    console.log("POST endpoint called.")
    const newMessage = req.body.message
    storedValues.push(newMessage)
    res.json({ messages: storedValues })
  })

  // The echo command simply echoes on command
  slackApp.command("/whatscooking", async ({ command, ack, respond }) => {
    console.log("/whatscooking", command)
    await ack()

    await respond(`yoyo ${command.text}`)
  })

  // mount(receiver.app)

  const currentTime = new Date().toTimeString()
  const msg = `The current time is ${currentTime}`
  await sendMessage(msg)

  // receiver.app.listen(port, () => {
  //   console.log(`Server running on port ${port}`)
  // })
}

init()

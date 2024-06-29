import { WebClient } from "@slack/web-api"
import { getEnv } from "../../utils/getEnv"

// Create a new instance of the WebClient class with the token read from your environment variable
const web = new WebClient(getEnv("SLACK_BOT_TOKEN"))
// The current date

export async function sendMessage(text: string) {
  try {
    // Use the `chat.postMessage` method to send a message from this app
    await web.chat.postMessage({
      channel: "#kitchen-gossip",
      text: text,
    })
    console.log("Message posted!")
  } catch (error) {
    console.log(error)
  }
}

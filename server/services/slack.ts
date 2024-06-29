import { getEnv } from "../utils/getEnv"

export async function postText(text: string) {
  const url = getEnv("SLACK_WEBHOOK")

  const payload = {
    channel: "#kitchen-gossip",
    username: "superbot",
    icon_emoji: ":bot:",
    text: text,
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error("Failed to post to Slack")
  } else {
    console.log("Posted to Slack", response.status)
  }
}

export async function postText(text: string) {
  const url = "https://hooks.slack.com/services/your-webhook-url"

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
  }
}

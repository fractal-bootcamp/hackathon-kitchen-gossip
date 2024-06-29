import OpenAI, { ClientOptions } from "openai"
import type { GithubStatus, GithubStatusList } from "../types/shared"
import { reviewPrompt } from "../data/prompts"

export function transformStatus(status: GithubStatus): string {
  const output = `
  user: ${status.user}
  status: ${status.pass}
  pass: ${status.pass}
  `
  return output
}

export async function reviewCommits(statusList: GithubStatusList) {
  const opts: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY,
  }
  const openai = new OpenAI(opts)

  const statusText = statusList.map(transformStatus).join("\n")
  console.log("statusText:", statusText)

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: reviewPrompt },
      { role: "user", content: statusText },
    ],
    model: "gpt-3.5-turbo",
  })

  const result = completion.choices[0]
  console.log("result:", result)
  return result
}

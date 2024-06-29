import OpenAI, { ClientOptions } from "openai"
import type { GithubStatus, GithubStatusList } from "../types/shared"
import { reviewPrompt } from "../data/prompts"
import { getEnv } from "../utils/getEnv"
import { getRecentCommits } from "./callGithub"

export function summarizeStatus(statusList: GithubStatusList) {
  const userName = statusList.map((status) => status.user)
  const uniqueNames = new Set(userName)

  const userResults = statusList.reduce((acc, status) => {
    if (acc[status.user]) {
      acc[status.user].push(status.pass)
    } else {
      acc[status.user] = [status.pass]
    }
    return acc
  })

  console.log("userResults:", userResults)

  // const userSummary = Object.keys(userNames).map((user) => {
  //   const passes = userNames[user].filter((pass) => pass).length
  //   return passes
  // })

  // console.log("userSummary:", userSummary)

  return userResults
}

/**
 * convert status from JSON to plain text to pass to LLM
 * @param status
 * @returns
 */
export function transformStatus(status: GithubStatus): string {
  const output = `
  user: ${status.user}
  status: ${status.pass}
  pass: ${status.pass}
  `
  return output
}

export async function reviewCommits(
  statusList: GithubStatusList
): Promise<string> {
  const opts: ClientOptions = {
    apiKey: getEnv("OPENAI_API_KEY"),
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

  const response = completion.choices[0]
  const text = response.message.content
  console.log("result:", { text })
  return text || "no response"
}

export async function getReviewStatus(): Promise<any> {
  // const review = {
  //   text: "review text",
  //   cooking: ["one", "two", "three"],
  // }

  const commits = await getRecentCommits({ mock: true })
  const users = commits.map((commit) => commit.user)
  const uniqueUsers = new Set(users)
  const status = {
    users: uniqueUsers,
    userCount: uniqueUsers.size,
    commits,
  }
  console.log("getReviewStatus:", status)

  return status
}

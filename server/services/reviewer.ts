import OpenAI, { ClientOptions } from "openai"
import type { GithubStatus, GithubStatusList } from "../types/shared"
import { reviewPrompt } from "../data/prompts"
import { getEnv } from "../utils/getEnv"
import { getRecentCommits } from "./callGithub"
import { CommitSummary, CommitsByUser } from "../types/CommitSummary"
import _ from "lodash"

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

function reviewUserCommits(CommitsByUser: CommitsByUser) {
  let commitCount = CommitsByUser.commits.length
  return `User: ${CommitsByUser.user} has ${commitCount} commits.`
}

async function evaluateCommits(): Promise<string> {
  const opts: ClientOptions = {
    apiKey: getEnv("OPENAI_API_KEY"),
  }
  const openai = new OpenAI(opts)

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: reviewPrompt },
      { role: "user", content: "testing" },
    ],
    model: "gpt-3.5-turbo",
  })

  const response = completion.choices[0]
  const text = response.message.content
  return text || "no response"
}

export async function reviewCommits(commits: CommitsByUser[]): Promise<string> {
  const reviews: string[] = []

  for (let cl of commits) {
    const review = reviewUserCommits(cl)
    reviews.push(review)
  }

  console.log("result:", reviews)
  return reviews.join("\n")
}

function getUniqueUsers(commits: CommitSummary[]) {
  const users = commits.map((commit) => commit.user)
  const uniqueUsers = _.uniq(users)
  return uniqueUsers
}

function getCommitsByUser(commits: CommitSummary[]): CommitsByUser[] {
  const users = getUniqueUsers(commits)

  let commitsByUser: any[] = []
  for (let user of users) {
    const cm = commits.filter((commit) => commit.user === user)
    commitsByUser.push({ user, commits: cm })
  }

  return commitsByUser
}

export async function getReviewStatus(): Promise<any> {
  // const review = {
  //   text: "review text",
  //   cooking: ["one", "two", "three"],
  // }
  const commits = await getRecentCommits()
  const users = getUniqueUsers(commits)

  const commitsByUser = getCommitsByUser(commits)
  const reviews = await reviewCommits(commitsByUser)

  const status = {
    commits,
    users,
    commitsByUser,
    reviews,
  }
  console.log("getReviewStatus:", status)

  return status
}

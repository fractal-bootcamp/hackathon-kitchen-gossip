import { getEnv } from "../utils/getEnv"

import { SLEEPS, sleep } from "../utils/sleep"

const getOneUserRepos = async (username: string): Promise<string[]> => {
  const gitHubToken = getEnv("GITHUB_AUTH_KEY")
  const url = `https://api.github.com/users/${username}/repos?sort=updated`
  const headerObject = {
    headers: {
      Authorization: `Bearer ${gitHubToken}`,
    },
  }

  const twelveHoursAgo = new Date(
    Date.now() - 12 * 60 * 60 * 1000
  ).toISOString()

  try {
    console.warn("GH CALL getRecentCommitList", { url })
    const response = await fetch(url, headerObject)

    if (!response.ok) {
      throw new Error("Failed to fetch repositories for user: ${username}")
    }
    const repos = await response.json()
    return repos
      .filter(
        (repo) => new Date(repo.updated_at).toISOString() > twelveHoursAgo
      )
      .map((repo) => repo.full_name)
  } catch (error) {
    console.log("ERRROR: problems here", error)
    return []
  }
}

export const getAllRepos = async (usernames: string[]): Promise<string[]> => {
  let allRepos: string[] = []
  for (const username of usernames) {
    await sleep(SLEEPS.githubApiSleep)
    const thisUsersRepos = await getOneUserRepos(username)
    allRepos = [...allRepos, ...thisUsersRepos]
  }
  console.log("outputArray:", allRepos)
  return allRepos
}

// const testData = await getAllRepos(["yablochko8", "fractal-bootcamp"])

// console.log(testData)

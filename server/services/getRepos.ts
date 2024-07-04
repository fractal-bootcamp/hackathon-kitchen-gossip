import { getEnv } from "../utils/getEnv";

import { SLEEP_TIMES, sleep } from "../utils/sleep";

/**
 * Get names of relevant repos for a list of given usernames
 * @usernames array of usernames to get repos for
 * @returns array of repo names
 */
export const getAllRepos = async (usernames: string[]): Promise<string[]> => {
  let allRepos: string[] = [];
  for (const username of usernames) {
    await sleep(SLEEP_TIMES.githubApiSleep);
    const thisUsersRepos = await getOneUserRepos(username);
    allRepos = [...allRepos, ...thisUsersRepos];
  }
  console.log("outputArray:", allRepos);
  return allRepos;
};

/**
 * Gets list of relevant repos for a signle username.
 * Fetches most recent list in a single call. Returns
 * all repos with changes from last 12 hours.
 */
const getOneUserRepos = async (username: string): Promise<string[]> => {
  const gitHubToken = getEnv("GITHUB_AUTH_KEY");
  const url = `https://api.github.com/users/${username}/repos?sort=updated`;
  const headerObject = {
    headers: {
      Authorization: `Bearer ${gitHubToken}`,
    },
  };

  const twelveHoursAgo = new Date(
    Date.now() - 12 * 60 * 60 * 1000
  ).toISOString();

  try {
    console.warn("GH CALL getRecentCommitList", { url });
    const response = await fetch(url, headerObject);

    if (!response.ok) {
      throw new Error("Failed to fetch repositories for user: ${username}");
    }
    const repos = await response.json();
    return repos
      .filter(
        (repo) => new Date(repo.updated_at).toISOString() > twelveHoursAgo
      )
      .map((repo) => repo.full_name);
  } catch (error) {
    console.log("ERRROR: problems here", error);
    return [];
  }
};

// const testData = await getAllRepos(["yablochko8", "fractal-bootcamp"])

// console.log(testData)

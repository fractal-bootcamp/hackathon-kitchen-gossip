import { gitHubToken } from "./callGithub";

const getOneUserRepos = async (username: string): Promise<string[]> => {
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

export const getAllRepos = async (usernames: string[]): Promise<string[]> => {
  let outputArray: string[] = [];
  for (const username of usernames) {
    const thisUsersRepos = await getOneUserRepos(username);
    outputArray = [...outputArray, ...thisUsersRepos];
  }
  return outputArray;
};

const testData = await getAllRepos(["yablochko8", "fractal-bootcamp"]);

console.log(testData);

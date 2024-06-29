import { gitHubToken } from "./callGithub";

const getOneUserRepos = async (username: string): Promise<string[]> => {
  const url = `https://api.github.com/users/${username}/repos`;
  const headerObject = {
    headers: {
      Authorization: `Bearer ${gitHubToken}`,
    },
  };
  try {
    const response = await fetch(url, headerObject);

    if (!response.ok) {
      throw new Error("you suck");
    }
    const repos = await response.json();
    return repos.map((repo) => repo.full_name);
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

// const testData = await getAllRepos(["yablochko8", "fractal-bootcamp"]);

// console.log(testData);

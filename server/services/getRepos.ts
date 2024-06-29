import { gitHubToken } from "./callGithub";


const getOneUserRepos = async (username: string): Promise<string[]> => {
  const url = `https://api.github.com/users/${username}/repos`
  const headerObject = {
    headers: {
      Authorization: `Bearer ${gitHubToken}`,
    },
  }
  try {

    const response = await fetch(url, headerObject)

    if (!response.ok) {
      throw new Error("you suck")
    }
    const repos = await response.json()
    return repos.map((repo) => repo)
  }
  catch (error) {
    console.log("ERRROR: problems here", error)
    return []
  }
}

export const getAllRepos = async (usernames: string[]): Promise<string[]> => {
  let outputArray: string[] = []
  for (const username of usernames) {
    const thisUsersRepos = await getOneUserRepos(username);
    outputArray = [...outputArray, ...thisUsersRepos]
  } return outputArray
}










// export const getAllRepos = async (usernames: string[]): Promise<string[]> => {
//   //insert logic here to get a list of repos that a user is a member of 
//   const usernamelist = usernames

//   usernamelist.map((username) => {
//     const fetchRepos = async (username: string): Promise<string[]> => {
//       try {
//         const reponse = await fetch(`https://api.github.com/users/${username}/repos`, {
//           headers: {
//             Authorization: `Bearer ${gitHubToken}`,
//           },
//         });
//         if (!reponse.ok) {
//           throw new Error("failed to fetch repos for user ${username}");
//         }
//         const data = await reponse.json();
//         return data.map((repo) => repo)
//       } catch (error) {
//         console.log(error);
//         return [];
//       }
//     }
//   })

// };

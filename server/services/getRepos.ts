export const getRepos = async (usernames: string[]): Promise<string[]> => {
  //insert logic here to get a list of repos that a user is a member of 
  const usernamelist = usernames
  usernamelist.map(() => {
    const fetchRepos = async (username: string): Promise<string[]> => {
      try {
        const reponse = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!reponse.ok) {
          throw new Error("failed to fetch repos for user ${username}");
        }
        const data = await reponse.json();
        return [data]
      } catch (error) {
        console.log(error);
        return [];
      }
    }
  })

};

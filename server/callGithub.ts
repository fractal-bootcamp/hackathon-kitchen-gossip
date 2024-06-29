import { sampleCommitSummary } from "./data/dummyData";
import { CommitSummary } from "./types/CommitSummary";

const usernames: string[] = ["yablochko8", "dxren", "absentuser"];

const getRepos = (usernames: string[]): string[] => {
  return ["fractal-bootcamp/hackathon-kitchen-gossip"];
};

const getRecentCommitList = async (
  repoName: string,
  timeSpan?: number
): Promise<string[]> => {
  // call github
  // each string in response should be a commit reference id
  return [];
};

const getCommitSummary = async (commitId: string): Promise<CommitSummary> => {
  // do another call to github
  // parse out response
  // may need to inject in a parseCommitInfo function here
  // return using type
  return sampleCommitSummary;
};

export const getRecentCommits = async (): Promise<CommitSummary[]> => {
  const arrayOfRepos = getRepos(usernames);

  const commitSummaries: CommitSummary[] = [];

  for (const repo of arrayOfRepos) {
    const commitIds = await getRecentCommitList(repo);

    for (const commit of commitIds) {
      const newSummary = await getCommitSummary(commit);
      commitSummaries.push(newSummary);
    }
  }

  return commitSummaries;
};

// yab@luimbp ~ % curl -i https://api.github.com/repos/fractal-bootcamp/hackathon-kitchen-gossip/git/commits/6ede89d0794feb8f2685db3d7eb91702d7354ffa

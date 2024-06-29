import { sampleCommitSummary } from "./data/dummyData";
import { CommitSummary } from "./types/CommitSummary";

const usernames: string[] = ["yablochko8", "dxren", "absentuser"];

const getRepos = (usernames: string[]): string[] => {
  return ["fractal-bootcamp/hackathon-kitchen-gossip"];
};

const getRecentCommitList = async (
  repoName: string,
  timeSpan: number = 4
): Promise<string[]> => {
  // take timeSpan value in HOURS
  // convert it to milliseconds
  const sinceDate = new Date(
    Date.now() - timeSpan * 60 * 60 * 1000
  ).toISOString();
  const githubUrl = `https://api.github.com/repos/${repoName}/commits?since=${sinceDate}`;

  try {
    const response = await fetch(githubUrl);
    if (!response.ok) {
      throw new Error(
        "FAILED TO GET RESPONSE FROM GITHUB: " + response.statusText
      );
    }
    const commits = await response.json();
    return commits.map((commit) => commit.sha);
  } catch (error) {
    console.error("ERROR: could not parse commits from response");
    return [];
  }
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

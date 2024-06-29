const usernames: string[] = ["yablochko8", "dxren", "absentuser"];

const getRepos = (usernames: string[]): string[] => {
  return ["fractal-bootcamp/hackathon-kitchen-gossip"];
};

type CommitSummary = {
  user: string;
  time: Date;
  message: string;
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
  actualChanges?: string;
};

const now = new Date();

const sampleCommitSummary: CommitSummary = {
  user: "dxren",
  time: now,
  message: "integrated slack bot wooooh",
  filesChanged: 1,
  linesAdded: 55,
  linesRemoved: 66,
};

const sampleCommitSummary2: CommitSummary = {
  user: "yabochk8",
  time: now,
  message: "broke all my tests and had to start again",
  filesChanged: 2,
  linesAdded: 77,
  linesRemoved: 166,
};

const sampleCommitSummary3: CommitSummary = {
  user: "dxren",
  time: now,
  message: "turns out the slack bot",
  filesChanged: 4,
  linesAdded: 55,
  linesRemoved: 66,
};
export const sampleCommitSummaries = [
  sampleCommitSummary,
  sampleCommitSummary2,
  sampleCommitSummary3,
];

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

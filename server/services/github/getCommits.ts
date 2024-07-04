import dotenv from "dotenv";
import { sampleCommitSummary } from "../../data/dummyData";
import { CommitSummary } from "../../types/CommitSummary";
import { sampleCommits } from "../../data/sampleCommits";
import { AppConfig } from "../../config/AppConfig";
// import { getAllRepos } from "./github/getRepos";
import { getEnv } from "../../utils/getEnv";
import { SLEEP_TIMES, sleep } from "../../utils/sleep";
dotenv.config();

// const usernames: string[] = [
//   "yablochko8",
//   "dxren",
//   "fractal-bootcamp",
//   "dcsan",
// ];

/**
 * Calls GitHub to get list of recent commits.
 */
const getRecentCommitList = async (
  repoName: string,
  timeSpan: number = 12
): Promise<string[]> => {
  // take timeSpan value in HOURS
  // convert it to milliseconds
  const sinceDate = new Date(
    Date.now() - timeSpan * 60 * 60 * 1000
  ).toISOString();
  const githubUrl = `https://api.github.com/repos/${repoName}/commits?since=${sinceDate}`;

  const gitHubToken = getEnv("GITHUB_AUTH_KEY");

  console.log(gitHubToken);

  try {
    console.warn("GH CALL getRecentCommitList", { githubUrl });
    const response = await fetch(githubUrl, {
      headers: {
        Authorization: `Bearer ${gitHubToken}`,
      },
    });
    if (!response.ok) {
      console.error(
        "FAILED TO GET RESPONSE FROM GITHUB: " + response.statusText
      );
      throw new Error(
        "FAILED TO GET RESPONSE FROM GITHUB: " + response.statusText
      );
    }
    const commits = await response.json();
    return commits.map((commit) => commit.sha);
  } catch (error) {
    console.error("ERROR: could not parse commits from response", error);
    return [];
  }
};

/**
 * Takes blob of GitHub response and returns a CommitSummary object.
 */
const parseCommitInfo = (
  commitData: any,
  ownerSlashRepo: string
): CommitSummary => {
  const filesChanged = commitData.files.length;
  const linesAdded = commitData.files.reduce(
    (sum: number, file: any) => sum + file.additions,
    0
  );
  const linesRemoved = commitData.files.reduce(
    (sum: number, file: any) => sum + file.deletions,
    0
  );

  const returnObj: CommitSummary = {
    user: commitData.commit.author.name,
    repo: ownerSlashRepo,
    time: new Date(commitData.commit.author.date),
    message: commitData.commit.message,
    linesAdded: linesAdded,
    linesRemoved: linesRemoved,
    filesChangedNum: filesChanged,
    filesChangedNames: commitData.files.map((file) => file.filename).join(", "),
    // actualChanges: add in later
  };

  return returnObj;
};

/**
 * Calls GitHub for details of a specific commit.
 */
const getCommitSummary = async (
  commitId: string,
  ownerSlashRepo: string
): Promise<CommitSummary> => {
  const commitUrl = `https://api.github.com/repos/${ownerSlashRepo}/commits/${commitId}`;

  try {
    console.warn("GH CALL getRecentCommitList", { commitUrl });
    const response = await fetch(commitUrl);
    if (!response.ok) {
      console.error("ERROR GETTING COMMIT INFO", { response });
      throw new Error("ERROR GETTING COMMIT INFO");
    }
    const commitData = await response.json();
    return parseCommitInfo(commitData, ownerSlashRepo);
  } catch (error) {
    console.error("Error fetching commit summary", { error, ownerSlashRepo });
    return sampleCommitSummary;
  }
};

/**
 * Calls GitHub to get recent commits.
 */
export const getCommitsOneRepo = async (
  ownerSlashRepo: string
): Promise<CommitSummary[]> => {
  if (AppConfig.mock) {
    console.warn("Using mock data");
    return sampleCommits;
  }

  console.warn(
    "ALT METHOD (4 JULY DEV NOTE): Attempting real GitHub API calls..."
  );
  const url = `https://api.github.com/repos/${ownerSlashRepo}/commits`;

  try {
    const response = await fetch(url);
    const commits = await response.json();

    const commitSummaries: CommitSummary[] = await Promise.all(
      commits.map(async (commit) => {
        const commitDetailResponse = await fetch(commit.url);
        const commitData = await commitDetailResponse.json();

        let linesAdded = 0;
        let linesRemoved = 0;
        let filesChanged = 0;

        if (commitData.files) {
          filesChanged = commitData.files.length;
          commitData.files.forEach((file) => {
            linesAdded += file.additions;
            linesRemoved += file.deletions;
          });
        }

        return {
          user: commitData.commit.author.name,
          repo: ownerSlashRepo,
          time: new Date(commitData.commit.author.date),
          message: commitData.commit.message,
          linesAdded: linesAdded,
          linesRemoved: linesRemoved,
          filesChangedNum: filesChanged,
          filesChangedNames: commitData.files
            .map((file) => file.filename)
            .join(", "),
        };
      })
    );

    return commitSummaries;
  } catch (error) {
    console.error("Error fetching commit data:", error);
  }
  console.log("SOMETHING HAS GONE WRONG - Returning mock data");
  return sampleCommits;
};

/**
 * Calls GitHub to get recent commits.
 */
export const getRecentCommits = async (): Promise<CommitSummary[]> => {
  if (AppConfig.mock) {
    console.warn("Using mock data");
    return sampleCommits;
  }
  console.warn("Attempting real GitHub API calls...");

  // const arrayOfRepos = await getAllRepos(usernames)
  const arrayOfRepos = [
    // "fractal-bootcamp/hackathon-kitchen-gossip",
    "fractal-bootcamp/lui.personal-site",
  ];

  const commitSummaries: CommitSummary[] = [];
  for (const ownerSlashRepo of arrayOfRepos) {
    console.log("Calling for commits on", ownerSlashRepo);

    const moreSummaries = await getCommitsOneRepo(ownerSlashRepo);
    if (moreSummaries.length) {
      console.log(
        `${moreSummaries.length} commits found for ${ownerSlashRepo}`
      );
      commitSummaries.push(...moreSummaries);
    } else {
      console.error("No commits found for repo", ownerSlashRepo);
    }
  }

  const maxAgeHrs = 4;
  console.log(`Removing all commits older than ${maxAgeHrs} hours.`);
  const maxAgeAgo = new Date(Date.now() - maxAgeHrs * 60 * 60 * 1000);
  const recentCommitSummaries = commitSummaries.filter(
    (commit) => commit.time > maxAgeAgo
  );

  console.log(
    `Returning a combined list of ${recentCommitSummaries.length} commitSummary objects.`
  );
  return recentCommitSummaries;
};

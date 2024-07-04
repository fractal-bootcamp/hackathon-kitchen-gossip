import dotenv from "dotenv";
import { sampleCommitSummary } from "../../data/dummyData";
import { CommitSummary } from "../../types/CommitSummary";
import { sampleCommits } from "../../data/sampleCommits";
import { AppConfig } from "../../config/AppConfig";
// import { getAllRepos } from "./github/getRepos";
import { getEnv } from "../../utils/getEnv";
import { SLEEP_TIMES, sleep } from "../../utils/sleep";
import { getCommitsViaGraph } from "./graphQL";
dotenv.config();

// const usernames: string[] = [
//   "yablochko8",
//   "dxren",
//   "fractal-bootcamp",
//   "dcsan",
// ];

/**
 * Calls GitHub to get list of recent commits.
 * repoName is in the format "owner-name/repo-name"
 * timeSpan is in hours
 */
const getCommitsOneRepo = async (
  repoName: string,
  timeSpan: number = 12
): Promise<CommitSummary[]> => {
  if (AppConfig.mock) {
    console.warn("Using mock data");
    return sampleCommits;
  }
  console.warn("Attempting real GitHub API calls for commits to:", repoName);

  const sinceDate = new Date(
    Date.now() - timeSpan * 60 * 60 * 1000
  ).toISOString();
  const githubUrl = `https://api.github.com/repos/${repoName}/commits?since=${sinceDate}`;

  const gitHubToken = getEnv("GITHUB_AUTH_KEY");

  try {
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

    const commitSummaries: CommitSummary[] = [];
    for (const commit of commits) {
      console.log("\n\n\n ZZZZZZ \n\n\n");
      console.log(commit.sha);
      const newCommitSummary = await detailedCommitInfo(commit, repoName);
      commitSummaries.push(newCommitSummary);
    }

    return commitSummaries;
  } catch (error) {
    console.error("ERROR: could not parse commits from response", error);
    return [];
  }
};

/**
 * Takes blob of GitHub response and returns a CommitSummary object.
 * Unfortunately this DOES actually call Github API every time.
 */
const detailedCommitInfo = async (
  commit: any,
  ownerSlashRepo: string
): Promise<CommitSummary> => {
  console.log("Parsing CommitInfo, ref:", commit.sha);
  const commitDetailResponse = await fetch(commit.url);
  const commitData = await commitDetailResponse.json();

  let linesAdded = 0;
  let linesRemoved = 0;
  let filesChanged = 0;
  let filesChangedNames = "";

  if (commitData.files) {
    filesChanged = commitData.files.length;
    commitData.files.forEach((file) => {
      linesAdded += file.additions;
      linesRemoved += file.deletions;
      filesChangedNames += file.filename + ", ";
    });
  }

  const returnObj: CommitSummary = {
    user: commitData.commit.author.name,
    repo: ownerSlashRepo,
    time: new Date(commitData.commit.author.date),
    message: commitData.commit.message,
    linesAdded: linesAdded,
    linesRemoved: linesRemoved,
    filesChangedNum: filesChanged,
    filesChangedNames: filesChangedNames,
    // actualChanges: add in later
  };

  return returnObj;
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
    "fractal-bootcamp/hackathon-kitchen-gossip",
    // "fractal-bootcamp/hackathon-kitchen-gossip",
  ];

  const commitSummaries: CommitSummary[] = [];
  for (const ownerSlashRepo of arrayOfRepos) {
    console.log("Calling for commits on", ownerSlashRepo);

    const moreSummaries = await getCommitsViaGraph(ownerSlashRepo);
    if (moreSummaries.length) {
      console.log(
        `${moreSummaries.length} commits found for ${ownerSlashRepo}`
      );
      commitSummaries.push(...moreSummaries);
    } else {
      console.error("No commits found for repo", ownerSlashRepo);
    }
  }

  console.log("example commitsummary", commitSummaries[0]);

  const maxAgeHrs = 12;
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

import { sampleCommitSummary } from "../data/dummyData";
import { CommitSummary } from "../types/CommitSummary";
import { sampleCommits } from "../data/sampleCommits";
import { AppConfig } from "../config/AppConfig";
import dotenv from "dotenv";
import { getAllRepos } from "./getRepos";

dotenv.config();

const usernames: string[] = [
  "yablochko8",
  "dxren",
  "fractal-bootcamp",
  "dcsan",
];

export const gitHubToken = process.env.GITHUB_AUTH_KEY;

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
    return commits.map((commit) => commit.sha);
  } catch (error) {
    console.error("ERROR: could not parse commits from response", error);
    return [];
  }
};

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

const getCommitSummary = async (
  commitId: string,
  ownerSlashRepo: string
): Promise<CommitSummary> => {
  const commitUrl = `https://api.github.com/repos/${ownerSlashRepo}/commits/${commitId}`;

  try {
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

export type CommitOpts = {
  mock: boolean;
};

export const getRecentCommits = async (): Promise<CommitSummary[]> => {
  if (AppConfig.mock) {
    console.warn("Using mock data");
    return sampleCommits;
  }

  const arrayOfRepos = await getAllRepos(usernames);
  // const arrayOfRepos = ["fractal-bootcamp/hackathon-kitchen-gossip"];

  const commitSummaries: CommitSummary[] = [];

  for (const ownerSlashRepo of arrayOfRepos) {
    const commitIds = await getRecentCommitList(ownerSlashRepo);

    for (const commit of commitIds) {
      const newSummary = await getCommitSummary(commit, ownerSlashRepo);
      commitSummaries.push(newSummary);
    }
  }
  console.log("commitSummaries", commitSummaries);
  return commitSummaries;
};

// const pleaseWork = await getRecentCommits();
// console.log(pleaseWork);

import type {
  GithubStatus,
  GithubStatusList,
  ReviewStatus,
} from "../types/shared";
import { getRecentCommits } from "./github/callGithub";
import { CommitSummary, CommitsByUser } from "../types/CommitSummary";
import _ from "lodash";
import { evaluateCommits } from "./openai/evaluateCommits";

/**
 * Gets list of relevant repos for a signle username.
 * Fetches most recent list in a single call. Returns
 * all repos with changes from last 12 hours.
 */
export function summarizeStatus(statusList: GithubStatusList) {
  const userResults = statusList.reduce((acc, status) => {
    if (acc[status.user]) {
      acc[status.user].push(status.pass);
    } else {
      acc[status.user] = [status.pass];
    }
    return acc;
  });

  console.log("userResults:", userResults);

  // const userSummary = Object.keys(userNames).map((user) => {
  //   const passes = userNames[user].filter((pass) => pass).length
  //   return passes
  // })

  // console.log("userSummary:", userSummary)

  return userResults;
}

/**
 * convert status from JSON to plain text to pass to LLM
 * @param status
 * @returns
 */
export function transformStatus(status: GithubStatus): string {
  const output = `
  user: ${status.user}
  status: ${status.pass}
  pass: ${status.pass}
  `;
  return output;
}

export function reviewUserCommits(CommitsByUser: CommitsByUser): string {
  const commitCount = CommitsByUser.commits.length;
  return `User: ${CommitsByUser.user} has ${commitCount} commits.`;
}

export async function reviewCommits(commits: CommitsByUser[]): Promise<string> {
  const reviews: string[] = [];

  for (const cl of commits) {
    const userReview = await evaluateCommits(cl);
    reviews.push(userReview);
  }

  console.log("result:", reviews);
  const results = reviews.join("\n\n");
  return results;
}

function getUniqueUsers(commits: CommitSummary[]) {
  const users = commits.map((commit) => commit.user);
  const uniqueUsers = _.uniq(users);
  return uniqueUsers;
}

function getCommitsByUser(commits: CommitSummary[]): CommitsByUser[] {
  const users = getUniqueUsers(commits);

  const commitsByUser: CommitsByUser[] = [];
  for (const user of users) {
    const cm = commits.filter((commit) => commit.user === user);
    commitsByUser.push({ user, commits: cm });
  }

  return commitsByUser;
}

export async function getReviewStatus(): Promise<ReviewStatus> {
  // const review = {
  //   text: "review text",
  //   cooking: ["one", "two", "three"],
  // }
  const commits = await getRecentCommits();
  const users = getUniqueUsers(commits);

  const commitsByUser = getCommitsByUser(commits);
  const reviews: string = await reviewCommits(commitsByUser);

  const status = {
    // commits,
    reviews,
    users,
    // commitsByUser,
  };
  console.log("getReviewStatus:", status);

  return status;
}

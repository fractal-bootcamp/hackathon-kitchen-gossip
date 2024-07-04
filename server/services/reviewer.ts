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

/**
 * Obsolete function - I don't believe this is ever called.
 */
function reviewUserCommits(CommitsByUser: CommitsByUser): string {
  const commitCount = CommitsByUser.commits.length;
  return `User: ${CommitsByUser.user} has ${commitCount} commits.`;
}

/**
 * Takes in array of CommitsByUser objects and passes them all
 * to the evaluateCommits function (which calls LLM), and then returns
 * a single string of LLM-generated reviews.
 */
async function reviewCommits(commits: CommitsByUser[]): Promise<string> {
  const reviews: string[] = [];

  for (const cl of commits) {
    const userReview = await evaluateCommits(cl);
    reviews.push(userReview);
  }

  console.log("result:", reviews);
  const results = reviews.join("\n\n");
  return results;
}

/**
 * Takes in a list of CommitSummary objects.
 * Returns a list of unique usernames from those objects.
 */
function getUniqueUsers(commits: CommitSummary[]) {
  const users = commits.map((commit) => commit.user);
  const uniqueUsers = _.uniq(users);
  return uniqueUsers;
}

/**
 * Takes in a list of CommitSummary objects.
 * Returns an object that lets you reference a list of a user's commits
 * by accessing returnObject.username
 */
function getCommitsByUser(commits: CommitSummary[]): CommitsByUser[] {
  const users = getUniqueUsers(commits);

  const commitsByUser: CommitsByUser[] = [];
  for (const user of users) {
    const cm = commits.filter((commit) => commit.user === user);
    commitsByUser.push({ user, commits: cm });
  }

  return commitsByUser;
}

/**
 * This is THE most important call. It triggers all the sub-calls to
 * Github and OpenAI, and parses the information into a format that
 * Slack can handle.
 */
export async function getReviewStatus(): Promise<ReviewStatus> {
  // Step 1 - get recent commits from GitHub
  const commits = await getRecentCommits();

  // Step 2 - organize that data into an array of CommitsByUser objects that
  //  look like: { user: "johndoe", commits = [ {CommitSummary1}, {CommitSummary2}, ... ] }
  const users = getUniqueUsers(commits);
  const commitsByUser = getCommitsByUser(commits);

  // Step 3 - Send commit data to OpenAI user by user and received back
  // LLM-generated reviews
  const reviews: string = await reviewCommits(commitsByUser);

  // Step 4 - Combine the reviews back with the usernames and return to Slack
  // QUESTION FOR DC - why is reviews a string here while users is an array?
  const status = {
    reviews,
    users,
  };
  console.log("getReviewStatus:", status);

  return status;
}

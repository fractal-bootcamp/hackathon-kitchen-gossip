import dotenv from "dotenv";
import { CommitSummary } from "../../types/CommitSummary";
import { sampleCommits } from "../../data/sampleCommits";
import { AppConfig } from "../../config/AppConfig";
import { getEnv } from "../../utils/getEnv";
// import { SLEEP_TIMES, sleep } from "../../utils/sleep";
import { getCommitsViaGraph } from "./graphQL";
import { getAllRepos } from "./getRepos";
dotenv.config();

/**
 * Calls GitHub to get recent commits.
 * If no owner is passed, defaults to fractal-bootcamp.
 * If no repo is passed, queries all repos for the owner.
 */
export const getRecentCommits = async (
  owner?: string,
  repo?: string,
  maxAgeHrs?: number
): Promise<CommitSummary[]> => {
  if (AppConfig.mock) {
    console.warn("Using mock data");
    return sampleCommits;
  }

  if (maxAgeHrs == null) {
    maxAgeHrs = 12;
  }

  if (!owner) {
    owner = "fractal-bootcamp";
  }

  console.warn("Attempting real GitHub API calls...");

  const arrayOfRepos: string[] = [];

  if (repo) {
    const singleRepo = `${owner}/${repo}`;
    console.log("Specific repo requested, only querying", singleRepo);
    arrayOfRepos.push(singleRepo);
  } else {
    console.log("No specific repo requested, querying all repos for", owner);
    const manyRepos = await getAllRepos([owner], maxAgeHrs);
    console.log(manyRepos.length, "relevant repos identified.");
    arrayOfRepos.push(...manyRepos);
  }

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

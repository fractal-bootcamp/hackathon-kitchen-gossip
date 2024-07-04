import { CommitSummary } from "../types/CommitSummary";
import { githubStatus, sampleCommitSummaries } from "../data/dummyData";
import { GithubStatusList } from "../types/shared";

export async function getStatus(opts?: any): Promise<CommitSummary[]> {
  return sampleCommitSummaries;
}

// I THINK this is unused trash code originally intended to pass hard-coded data back
// when we were hitting rate limits.

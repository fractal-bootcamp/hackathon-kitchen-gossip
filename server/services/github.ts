import { CommitSummary } from "../types/CommitSummary"
import { githubStatus, sampleCommitSummaries } from "../data/dummyData"
import { GithubStatusList } from "../types/shared"

export async function getStatus(opts?: any): Promise<CommitSummary[]> {
  return sampleCommitSummaries
}

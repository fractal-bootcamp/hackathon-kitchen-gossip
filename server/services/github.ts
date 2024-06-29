import { githubStatus } from "../data/dummyData"
import { GithubStatusList } from "../types/shared"

export async function getStatus(opts?: any): Promise<GithubStatusList> {
  return githubStatus
}

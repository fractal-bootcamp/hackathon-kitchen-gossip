import { getRecentCommits } from "./services/callGithub"
import { getReviewStatus } from "./services/reviewer"

async function main() {
  const cmd = process.argv[2]
  console.log("cli")
  switch (cmd) {
    case "getCommits":
      const commits = await getRecentCommits()
      console.log(commits)
      break

    case "getReview":
      const status = await getReviewStatus()
      console.log(status)
      break

    default:
      console.log("Command not found")
  }
}

main()

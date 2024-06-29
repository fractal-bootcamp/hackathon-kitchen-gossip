async function main() {
  const cmd = process.argv[2]
  console.log("cli")
  switch (cmd) {
    case "getCommits":
      const { getRecentCommits } = await import("./services/callGithub")
      const commits = await getRecentCommits()
      console.log(commits)
      break
    default:
      console.log("Command not found")
  }
}

main()

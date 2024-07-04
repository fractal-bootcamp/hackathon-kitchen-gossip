import { getRecentCommits } from "./services/github/callGithub";
import { getReviewStatus } from "./services/reviewer";

async function main() {
  const cmd = process.argv[2];

  let commits, reviews;
  console.log("cli");
  switch (cmd) {
    case "getCommits":
      commits = await getRecentCommits();
      console.log(commits);
      break;

    case "getReview":
      reviews = await getReviewStatus();
      console.log(reviews);
      break;

    default:
      console.log("Command not found");
  }
}

main();

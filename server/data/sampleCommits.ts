import { CommitSummary } from "../types/CommitSummary";

export const sampleCommits: CommitSummary[] = [
  {
    user: "dcsan",
    time: "",
    message: "Merge branch 'dc/wip'",
    linesAdded: 102,
    linesRemoved: 43,
    repo: "fractal-bootcamp/hackathon-kitchen-gossip",
    filesChangedNum: 5,
    filesChangedNames:
      "server/cli.ts, server/justfile, server/routes/status.ts, server/services/callGithub.ts, server/services/reviewer.ts",
  },
  {
    user: "dcsan",
    time: "",
    message: "change error handling",
    linesAdded: 52,
    linesRemoved: 10,
    repo: "fractal-bootcamp/hackathon-kitchen-gossip",
    filesChangedNum: 5,
    filesChangedNames:
      "server/cli.ts, server/justfile, server/routes/status.ts, server/services/callGithub.ts, server/services/reviewer.ts",
  },
  {
    user: "dcsan",
    time: "",
    message: "adding cli",
    linesAdded: 54,
    linesRemoved: 37,
    repo: "fractal-bootcamp/hackathon-kitchen-gossip",
    filesChangedNum: 3,
    filesChangedNames:
      "server/cli.ts, server/justfile, server/services/callGithub.ts",
  },
  {
    user: "yab",
    time: "",
    message: "file move",
    linesAdded: 4,
    linesRemoved: 4,
    repo: "fractal-bootcamp/hackathon-kitchen-gossip",
    filesChangedNum: 2,
    filesChangedNames:
      "server/services/callGithub.ts, server/services/getRepos.ts",
  },
];

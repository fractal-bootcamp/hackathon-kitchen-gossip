import { CommitSummary } from "../types/CommitSummary";
import { GithubStatusList } from "../types/shared";

export const githubStatus: GithubStatusList = [
  {
    user: "andy",
    date: "2021-09-01T00:00:00Z",
    message: "first commit",
    status: "PASS",
    commit: "f1b9a4a",
    branch: "main",
    pass: true,
  },
  {
    user: "bobby",
    date: "2021-09-01T00:00:00Z",
    message: "second commit",
    status: "FAIL",
    commit: "f1b9a4a",
    branch: "main",
    pass: false,
  },
  {
    user: "charlie",
    date: "2021-09-01T00:00:00Z",
    message: "third commit",
    status: "PASS",
    commit: "f1b9a4a",
    branch: "main",
    pass: true,
  },
];

const now = new Date();

export const sampleCommitSummary: CommitSummary = {
  user: "dxren",
  time: now,
  message: "integrated slack bot wooooh",
  filesChanged: 1,
  linesAdded: 55,
  linesRemoved: 66,
};

const sampleCommitSummary2: CommitSummary = {
  user: "yabochk8",
  time: now,
  message: "broke all my tests and had to start again",
  filesChanged: 2,
  linesAdded: 77,
  linesRemoved: 166,
};

const sampleCommitSummary3: CommitSummary = {
  user: "dxren",
  time: now,
  message: "turns out the slack bot",
  filesChanged: 4,
  linesAdded: 55,
  linesRemoved: 66,
};
export const sampleCommitSummaries = [
  sampleCommitSummary,
  sampleCommitSummary2,
  sampleCommitSummary3,
];

import { GithubStatusList } from "../types/shared"

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
]

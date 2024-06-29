// {
//   user: "andy",
//   date: "2021-09-01T00:00:00Z",
//   message: "first commit",
//   status: "success",
//   commit: "f1b9a4a",
//   branch: "main",
//   ok: true,
// },

export type GithubStatus = {
  user: string
  date: string
  message: string
  status: string
  commit: string
  branch: string
  pass: boolean
}

export type GithubStatusList = GithubStatus[]

export type ReviewItem = {
  user: string
  pass: number
  fail: number
  comment: string
}

export type ReviewList = ReviewItem[]

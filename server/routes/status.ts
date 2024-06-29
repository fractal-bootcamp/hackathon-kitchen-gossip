// status check

import { getStatus } from "../services/github"
import { reviewCommits } from "../services/reviewer"

export function mount(app) {
  app.get("/api/status", async (req, res) => {
    const githubStatus = await getStatus()
    const review = await reviewCommits(githubStatus)
    console.log("STATUS called")
    res.json({ message: "status", result: review })
  })
}

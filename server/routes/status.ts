// status check

import { getStatus } from "../services/github"
import { reviewCommits, summarizeStatus } from "../services/reviewer"
import { postText } from "../services/slack"

export function mount(app) {
  app.get("/api/status", async (req, res) => {
    const githubStatus = await getStatus()
    const review = await reviewCommits(githubStatus)
    const summary = summarizeStatus(githubStatus)
    await postText(review)
    console.log("STATUS called")
    res.json({
      message: "status",
      review,
      summary,
    })
  })
}

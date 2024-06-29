// status check

import { getStatus } from "../services/github"
import {
  getReviewStatus,
  reviewCommits,
  summarizeStatus,
} from "../services/reviewer"
import { postText } from "../services/slack"

export function mount(app) {
  app.get("/api/status", async (req, res) => {
    const review = await getReviewStatus()

    // await postText(review.text)
    console.log("STATUS called")
    res.json({
      message: "status",
      review,
    })
  })
}

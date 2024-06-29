// status check

import { getReviewStatus } from "../services/reviewer"
import { postText } from "../services/slack"
import { ReviewStatus } from "../types/shared"

export function mount(app) {
  app.get("/api/status", async (req, res) => {
    const reviewStatus: ReviewStatus = await getReviewStatus()
    await postText(reviewStatus.reviews)
    // await postText(review.text)
    console.log("STATUS called")
    res.json({
      message: "status",
      reviewStatus,
    })
  })
}

import express from "express";
import cors from "cors";
import { getReviewStatus } from "./services/reviewer";
import { ReviewStatus } from "./types/shared";
import { getRecentCommits } from "./services/github/getCommits";
import { CommitSummary } from "./types/CommitSummary";

const PORT = process.env.SERVER_PORT;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/express/heartbeat", async (req, res) => {
  const resMessage = "hello world";
  console.log("GET request to /express/heartbeat");
  res.json({ message: resMessage });
});

app.post("/express/recent-commits", async (req, res) => {
  console.log("POST request to /express/recent-commits");
  const { owner, repo }: { owner?: string; repo?: string } = req.body;
  try {
    const recentCommits: CommitSummary[] = await getRecentCommits(owner, repo);
    res.json({ commits: recentCommits });
  } catch (error) {
    console.error("Error requesting reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

app.post("/express/full-flow", async (req, res) => {
  console.log("POST request to /express/full-flow");
  try {
    const reviewStatus: ReviewStatus = await getReviewStatus();
    const result = {
      reviews: reviewStatus.reviews,
      users: reviewStatus.users,
    };
    res.json(result);
  } catch (error) {
    console.error("Error requesting reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

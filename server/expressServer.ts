import express from "express";
import cors from "cors";
import { getReviewStatus } from "./services/reviewer";
import { ReviewStatus } from "./types/shared";

const PORT = process.env.SERVER_PORT;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/express/heartbeat", async (req, res) => {
  const resMessage = "hello world";
  res.json({ message: resMessage });
});

app.post("/express/request-reviews", async (req, res) => {
  try {
    const reviewStatus: ReviewStatus = await getReviewStatus();

    ///
    // turn reviewStatus into format that can returned as a response
    // const result = ???
    // res.json(result);
  } catch (error) {
    console.error("Error requesting reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

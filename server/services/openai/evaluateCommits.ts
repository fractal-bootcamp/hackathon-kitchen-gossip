import OpenAI, { ClientOptions } from "openai";
import { reviewUserCommits3 } from "../../data/prompts";
import { getEnv } from "../../utils/getEnv";
import { CommitsByUser } from "../../types/CommitSummary";

/**
 * Takes in a username and array of commits.
 * Passes them to LLM.
 * Returns LLM-generated review.
 */
export async function evaluateCommits(
  commitsByUser: CommitsByUser
): Promise<string> {
  const opts: ClientOptions = {
    apiKey: getEnv("OPENAI_API_KEY"),
  };
  const openai = new OpenAI(opts);

  const user = commitsByUser.user;
  let lines = `Commits by ${user}:\n`;
  lines += commitsByUser.commits.map((commit) => commit.message).join("\n");
  const text = user + lines;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: reviewUserCommits3 },
      { role: "user", content: text },
    ],
    model: "gpt-3.5-turbo",
  });

  const response = completion.choices[0];
  const review = response.message.content;

  console.log("evaluate", { user, data: lines, review });

  return review || "no response";
}

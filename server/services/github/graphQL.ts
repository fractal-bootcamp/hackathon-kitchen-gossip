import { CommitSummary } from "../../types/CommitSummary";
import { getEnv } from "../../utils/getEnv";
import { getFirstNonNull } from "../../utils/getFirstNonNull";
import { getName } from "./getName";

/**
 * Query builder is here: https://docs.github.com/en/graphql/overview/explorer
 */
const buildGraphQuery = (owner: string, repo: string): string => {
  const query = `
  {
    repository(owner: "${owner}", name: "${repo}") {
      refs(refPrefix: "refs/heads/", first: 100) {  # Fetching all branches
        edges {
          node {
            name
            target {
              ... on Commit {
                history(first: 20) {  # Fetching commit history for each branch, "first" seems to be newest
                  edges {
                    node {
                      author {
                        user {
                          login
                        }
                        name
                        email
                        date
                      }
                      committer {
                        user {
                          login
                        }
                        email
                      }
                      message
                      additions
                      deletions
                      changedFilesIfAvailable
                      tree {
                        entries {
                          path
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
    `;
  return query;
};

export const getCommitsViaGraph = async (
  ownerSlashRepo: string
): Promise<CommitSummary[]> => {
  console.log("getCommitsViaGraph called", ownerSlashRepo);
  const [owner, repo] = ownerSlashRepo.split("/");
  const token = getEnv("GITHUB_AUTH_KEY");
  const query = buildGraphQuery(owner, repo);
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    console.log("FULL response is", data);

    const commits: CommitSummary[] = [];

    data.data.repository.refs.edges.forEach((refEdge) => {
      console.log("Parsing from branch:", refEdge.node.name);
      refEdge.node.target.history.edges.forEach((historyEdge) => {
        const commit = historyEdge.node;

        // The challenge:
        // Some commits are from users developing locally and merging to branches they're working on.
        // Others come from the website. The only a value within the commit object that you can reliably
        // reference to tie together commits from a user with a single GitHub account working across
        // seems to be the EMAIL address, although that also can change.
        //
        // To complicate things, some commits have both a committer and an author. But some seem to be
        // missing one of those values. This is based on error logs.
        //
        // Solution for now:
        //
        // Step 1 - Check if the author exists. If it does, use that. If not, use the committer.
        // Step 2 - Check if the there's a login provided. If there is, use that. If not, use the name.

        const authorOrCommitter = getFirstNonNull(
          commit.author,
          commit.committer
        );

        const preferredName = authorOrCommitter.user
          ? authorOrCommitter.user.login
          : authorOrCommitter.name;

        const slackName = getName(preferredName);

        commits.push({
          user: slackName,
          repo: `${owner}/${repo}`,
          time: new Date(commit.author.date),
          message: commit.message,
          linesAdded: commit.additions,
          linesRemoved: commit.deletions,
          filesChangedNum: commit.changedFilesIfAvailable,
          filesChangedNames: commit.tree.entries
            .map((fileEdge) => fileEdge.path)
            .join(", "),
        });
      });
    });

    return commits;
  } catch (error) {
    console.error("Error fetching commit data:", error);
    return [];
  }
};

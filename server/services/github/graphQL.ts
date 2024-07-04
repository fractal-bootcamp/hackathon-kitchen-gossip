import { CommitSummary } from "../../types/CommitSummary";
import { getEnv } from "../../utils/getEnv";

const buildGraphQuery = (owner: string, repo: string): string => {
  const query = `
    {
      repository(owner: "${owner}", name: "${repo}") {
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 100) {
                edges {
                  node {
                    author {
                      name
                      date
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

    console.log("getCommitsViaGraph data", data);

    const commits: CommitSummary[] =
      data.data.repository.defaultBranchRef.target.history.edges.map((edge) => {
        const commit = edge.node;
        return {
          user: commit.author.name,
          repo: `${owner}/${repo}`,
          time: new Date(commit.author.date),
          message: commit.message,
          linesAdded: commit.additions,
          linesRemoved: commit.deletions,
          filesChangedNum: commit.changedFilesIfAvailable,
          filesChangedNames: commit.tree.entries
            .map((fileEdge) => fileEdge.path)
            .join(", "),
        };
      });

    return commits;
  } catch (error) {
    console.error("Error fetching commit data:", error);
    return [];
  }
};

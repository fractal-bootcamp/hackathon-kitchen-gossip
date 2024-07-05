import { CommitSummary } from "../../types/CommitSummary";
import { getEnv } from "../../utils/getEnv";

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

    const commits: CommitSummary[] = [];

    data.data.repository.refs.edges.forEach((refEdge) => {
      console.log("Parsing from branch:", refEdge.node.name);
      refEdge.node.target.history.edges.forEach((historyEdge) => {
        const commit = historyEdge.node;
        commits.push({
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
        });
      });
    });

    return commits;
  } catch (error) {
    console.error("Error fetching commit data:", error);
    return [];
  }
};

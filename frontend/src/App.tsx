import { useState } from "react";
import "./App.css";

export const PORT = 4101; // change this to an import before doing anything serious

const serverPath = `http://localhost:${PORT}`;

const checkHeartbeat = async () => {
  console.log("Calling GET endpoint.")
  const response = await fetch(`${serverPath}/express/heartbeat`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  console.log("Server response was:", json.message);
  return json.message; // unused for now
};

/**
 * Calls the Express endpoint to get recent commits from GitHub.
 * A typical repo address looks like: github.com/owner-name/repo-name
 * @param owner The owner of the repository. Usually a team / org / user name.
 * @param repo The repository name with no slashes.
 * @param callBack A function that will be executed on the output if passed.
 */
const getCommitsFromExpress = async (
  owner?: string,
  repo?: string,
  callBack?: Function
) => {
  console.log(`Calling POST endpoint with owner-name/repo-name: ${owner}/${repo}`);
  const body: any = {};
  if (owner) body.owner = owner;
  if (repo) body.repo = repo;

  const response = await fetch(`${serverPath}/express/recent-commits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = await response.json();

  const recentCommits = json.commits;
  console.log("Server response was:", recentCommits);

  // For debugging / dev:
  // Transform each commit object into a string
  // that can be displayed on local app
  const formattedCommits = recentCommits.map((commit: any) => {
    return `User: ${commit.user}, Repo: ${commit.repo}, Time: ${commit.time}, Message: ${commit.message}, Lines Added: ${commit.linesAdded}, Lines Removed: ${commit.linesRemoved}, Files Changed: ${commit.filesChangedNum}`;
  });
  if (callBack) {
    callBack(formattedCommits);
  }
  return recentCommits;
};



/**
 * Calls the Express endpoint to get recent commits from GitHub.
 * A typical repo address looks like: github.com/owner-name/repo-name
 * @param owner The owner of the repository. Usually a team / org / user name.
 * @param repo The repository name with no slashes.
 * @param callBack A function that will be executed on the output if passed.
 */
const getReviewsFromExpress = async (
  owner?: string,
  repo?: string,
  callBack?: Function
) => {
  console.log(`Calling POST endpoint with owner-name/repo-name: ${owner}/${repo}`);
  const body: any = {};
  if (owner) body.owner = owner;
  if (repo) body.repo = repo;

  const response = await fetch(`${serverPath}/express/full-flow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = await response.json();

  const reviews = json.reviews;
  const users = json.users;
  console.log("Server response was reviews:", reviews); // Currently a STRING
  console.log("Server response was users:", users); // Currently an ARRAY

  if (callBack) {
    callBack([reviews]);
  }
  return reviews;
};





function App() {
  const [ownerInput, setOwnerInput] = useState("");
  const [repoInput, setRepoInput] = useState("");
  const [valuesFromServer, setValuesFromServer] = useState(["no response yet"]);

  // const tailwindButtonClass = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
  // for some reason tailwind not working rn...fix later.

  const simpleButtonStyles = {
    backgroundColor: "#4299e1",
    color: "white",
    fontWeight: "bold",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
  }

  const rowClass = "flex flex-row items-center justify-center m-10";
  // Whyyyy is this not working??

  return (
    <>
      <div className={rowClass}>
        Check the server heartbeat:
      </div>
      <div className={rowClass}>

        <button
          style={simpleButtonStyles}
          onClick={() => checkHeartbeat()}
        >
          GET call
        </button>
      </div>
      <div>Open browser console to see response.</div>
      <br />
      <br />
      <div>A typical repo address looks like: github.com/owner-name/repo-name</div>
      <div style={{ fontSize: "0.8rem", color: "grey" }}>
        Leave repo-name blank to get commits from all repos under a specific owner.
        <br />
        The app will only look at repos that have seen work in the last 12 hours.
      </div>



      <input
        type="text"
        placeholder="owner-name"
        value={ownerInput}
        onChange={(e) => {
          setOwnerInput(e.target.value);
        }}
      />
      <span style={{ margin: "0 10px", fontSize: "1.2rem" }}>/</span>      <input
        type="text"
        placeholder="repo-name"
        value={repoInput}
        onChange={(e) => {
          setRepoInput(e.target.value);
        }}
      />

      <br />
      <br />
      <br />
      <div>Call GitHub for recent commits:</div>
      <button
        style={simpleButtonStyles}
        onClick={() =>
          getCommitsFromExpress(ownerInput, repoInput, setValuesFromServer)
        }
      >
        GitHub Test
      </button>
      <br />
      <br />

      <div>OR trigger a full Server -&gt; GitHub -&gt; OpenAI flow:</div>
      <button
        style={simpleButtonStyles}
        onClick={() =>
          getReviewsFromExpress(ownerInput, repoInput, setValuesFromServer)
        }
      >
        E2E test
      </button>

      <br />
      <br />
      <br />
      <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Output:</div>

      <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
        {valuesFromServer.map((value, index) => {
          return <div key={index} style={{ marginBottom: "5px", whiteSpace: "pre-wrap" }}>{value}</div>;
        })}
      </div>
    </>
  );
}

export default App;

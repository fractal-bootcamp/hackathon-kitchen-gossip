import React, { useState } from "react";
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
const getRecentCommitsFromServer = async (
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
// ADD THIS BACK ONCE GITHUB TEST IS WORKING
// 
// const testFullFlow = async (
//   message: string,
//   setValuesFromServer: Function
// ) => {
//   const response = await fetch(`${serverPath}/express/full-flow`, {
//     method: "POST",
//     body: JSON.stringify({ message }),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   const json = await response.json();
//   const updatedMessages = json.messages;
//   console.log("The server response was:", updatedMessages);
//   setValuesFromServer(updatedMessages);
//   return json.messages; // unused here
// };

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
          getRecentCommitsFromServer(ownerInput, repoInput, setValuesFromServer)
        }
      >
        POST call
      </button>
      <div>Responses will appear here:</div>

      {valuesFromServer.map((value, index) => {
        return <div key={index}>{value}</div>;
      })}
    </>
  );
}

export default App;

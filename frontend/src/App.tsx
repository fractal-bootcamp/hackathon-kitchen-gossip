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


const getRecentCommitsFromServer = async (
  message: string, // unused for now
  setValuesFromServer: Function
) => {
  console.log("Calling POST endpoint with message:", message)
  const response = await fetch(`${serverPath}/express/recent-commits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();

  const recentCommits = json.commits
  console.log("Server response was:", recentCommits)
  setValuesFromServer(recentCommits)
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
  const [submittedValue, setSubmittedValue] = useState("");
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
  return (
    <>
      <div>Check the server heartbeat:</div>

      <button
        style={simpleButtonStyles}
        onClick={() => checkHeartbeat()}
      >
        GET call
      </button>
      <div>Open browser console to see response.</div>
      <br />
      <br />

      <div>Enter text here:</div>
      <input
        type="text"
        value={submittedValue}
        onChange={(e) => {
          setSubmittedValue(e.target.value);
        }}
      />
      <div>(this currently does nothing)</div>

      <br />
      <br />
      <br />
      <div>Call GitHub for recent commits:</div>
      <button
        style={simpleButtonStyles}
        onClick={() =>
          getRecentCommitsFromServer(submittedValue, setValuesFromServer)
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

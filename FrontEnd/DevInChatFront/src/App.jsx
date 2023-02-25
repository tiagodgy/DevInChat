import { useState, useEffect } from "react";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

const imgAutoScroll = "/autoscroll.png";
const imgNoScroll = "/stopscroll.png";

function App() {
  const [username, setUsername] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);

  function GetRandomName() {
    const shortName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      length: 2,
    });
    return shortName;
  }

  useEffect(() => {
    const usernames = JSON.parse(localStorage.getItem("username"));
    if (usernames) {
      setUsername(usernames);
    } else {
      const names = [];
      const name = GetRandomName();
      names.push(name);
      setUsername(name);
      localStorage.setItem("username", JSON.stringify(names));
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-screen bg-neutral-800">
      <h1 className="text-neutral-100 text-3xl mt-3">DevInChat</h1>
      <h3 className="text-neutral-100 text-md mt-3 text-center max-w-md">
        Anonymously talk with people all over the world. Your current username
        is <span className="text-sky-600 font-bold"> {username}</span>. If the
        browser cache is wiped you will be assigned a new username.
      </h3>
      <div className="bg-neutral-700 rounded w-11/12 max-w-md h-4/6 mt-5 overflow-y-scroll overflow-x-hidden scrollbar-hide"></div>
      <div className="flex flex-row mt-3 mb-3 w-11/12 max-w-md items-center">
        <input
          type="text"
          className="rounded mr-3 w-11/12 p-1 bg-transparent text-neutral-100 border-neutral-700 border-2"
        />
        <button className="bg-sky-600 p-1 mr-1 rounded flex items-center justify-center hover:bg-sky-700">
          <img src="/send.png" className="w-7"></img>
        </button>
        <button
          className="bg-gray-600 p-1 rounded flex items-center justify-center hover:bg-gray-700"
          onClick={() => {
            if (autoScroll) {
              setAutoScroll(false);
            } else {
              setAutoScroll(true);
            }
          }}
        >
          <img
            src={autoScroll ? imgAutoScroll : imgNoScroll}
            className="w-7"
          ></img>
        </button>
      </div>
    </div>
  );
}

export default App;

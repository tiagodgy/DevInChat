import { sendMessage } from "@microsoft/signalr/dist/esm/Utils";
import { useState, useEffect, useRef } from "react";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";
import { API } from "./Services/Api";
import { Websocket } from "./Services/Websocket";

const imgAutoScroll = "/autoscroll.png";
const imgNoScroll = "/stopscroll.png";

function App() {
  const [username, setUsername] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const saveConnection = useRef();
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [search, setSearch] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [reportMenu, setReportMenu] = useState(false);
  const [reportMenuInfo, setReportMenuInfo] = useState({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function GetRandomName() {
    const shortName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      length: 2,
    });
    return shortName;
  }

  function SearchMessages() {
    if (search && searchInput != "") {
      fetch(API + "/api/Messages/" + searchInput)
        .then((response) => response.json())
        .then((data) => setMessages(data))
        .catch((error) => console.error("Unable to get items.", error));
      setSearch(false);
    } else {
      setSearchInput("");
      GetLastMessages();
      setSearch(true);
    }
  }

  function SaveUserInDatabase(username) {
    var date = new Date();
    var dateEdit = date.toISOString().slice(0, 19).toString();
    fetch(API + "/api/Users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        firstAccess: dateEdit,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        getItems();
        addNameTextbox.value = "";
      })
      .catch((error) => console.error("Unable to add item.", error));
  }

  function VerifyUserName(username) {
    var bool;
    fetch(API + "/api/Users/" + username)
      .then((response) => response.json())
      .then((data) => (bool = data))
      .catch((error) => console.error("Unable to get items.", error));

    return bool;
  }

  function GetLastMessages() {
    fetch(API + "/api/Messages/")
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Unable to get items.", error));
  }

  function ConnectWebsocket() {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(Websocket + "/chathub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("ReceiveMessage", (user, message) => {
      setMessages((messages) => [
        ...messages,
        { userName: user, text: message },
      ]);
    });

    saveConnection.current = connection;

    async function start() {
      try {
        await connection.start();
        console.log("SignalR Connected.");
      } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
      }
    }

    connection.onclose(async () => {
      await start();
    });

    // Start the connection.
    start();
  }

  function SendMessage() {
    const send = async () => {
      if (textInput != "") {
        try {
          await saveConnection.current.invoke(
            "SendMessage",
            username.toString(),
            textInput
          );
        } catch (err) {
          console.error(err);
        }
      }
    };
    if (!search) {
      send().then(() => {
        GetLastMessages();
      });
      setSearchInput("");
      setSearch(true);
    } else {
      send();
    }
    setTextInput("");
  }

  function SendReport(id, user, message) {
    const send = async () => {
      try {
        await saveConnection.current.invoke("SendReport", id, user, message);
      } catch (err) {
        console.error(err);
      }
    };
    send();
  }

  function handleKeyPress(event) {
    if (event.key == "Enter") {
      SendMessage();
    }
  }

  function RenderMessageList() {
    return (
      <div className="w-11/12 h-full mt-1">
        {messages.map((message, index) => (
          <div key={message + index} className="flex flex-col mb-1">
            <div className="flex flex-row">
              <h3
                className={
                  username == message.userName
                    ? "text-sky-600 font-bold"
                    : "text-orange-500 font-bold"
                }
              >
                <span className="text-neutral-500 mr-1">
                  {message.date ? message.date.slice(11, 16) : "now"}
                </span>
                {message.userName}:
              </h3>
              {message.id ? (
                <button
                  className="ml-auto"
                  onClick={() => {
                    setReportMenu(true);
                    setReportMenuInfo({
                      id: message.id,
                      userName: message.userName,
                      text: message.text,
                    });
                  }}
                >
                  <h3 className="text-neutral-600 hover:text-red-500">
                    Report
                  </h3>
                </button>
              ) : (
                ""
              )}
            </div>
            <p className="ml-2 text-neutral-100 flex-wrap break-all">
              {message.text}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  }

  function RenderReportMenu() {
    if (reportMenu) {
      return (
        <div className="absolute bottom-1/2 bg-neutral-900 w-10/12 max-w-md sm:w-96 flex flex-col items-center h-fit rounded-xl">
          <h3 className="text-neutral-100 mt-3 text-center mx-2">
            Do you want to report {reportMenuInfo.userName} for following
            message:
          </h3>
          <p className="text-neutral-100 mx-2">"{reportMenuInfo.text}"</p>
          <div className="flex flex-row mt-3 mb-3 w-full justify-center">
            <button
              className="bg-red-600 mr-5 rounded w-4/12 p-1"
              onClick={() => {
                SendReport(
                  reportMenuInfo.id,
                  reportMenuInfo.userName,
                  reportMenuInfo.text
                );
                setReportMenu(false);
                setReportMenuInfo({});
              }}
            >
              Confirm
            </button>
            <button
              className="bg-sky-600 rounded w-4/12 p-1"
              onClick={() => {
                setReportMenu(false);
                setReportMenuInfo({});
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }
  }

  useEffect(ConnectWebsocket, []);

  useEffect(() => {
    SaveUserName();
  }, []);

  function SaveUserName() {
    const usernames = JSON.parse(localStorage.getItem("username"));
    if (usernames) {
      setUsername(usernames);
    } else {
      const names = [];
      const name = GetRandomName();
      if (!VerifyUserName(name)) {
        names.push(name);
        setUsername(name);
        localStorage.setItem("username", JSON.stringify(names));
        SaveUserInDatabase(name);
      } else {
        SaveUserName();
      }
    }
  }

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(GetLastMessages, []);

  return (
    <div className="flex flex-col items-center w-full h-screen bg-neutral-800">
      {RenderReportMenu()}
      <h1 className="text-neutral-100 text-3xl mt-3">DevInChat</h1>
      <h3 className="text-neutral-100 text-md mt-3 text-center max-w-md">
        Anonymously talk with people all over the world. Your current username
        is <span className="text-sky-600 font-bold"> {username}</span>. If the
        browser cache is wiped you will be assigned a new username.
      </h3>
      <div className="flex flex-row mt-3 w-11/12 max-w-md items-center">
        <input
          className="rounded p-1 bg-transparent text-neutral-100 border-neutral-700 border-2 w-11/12 mr-3"
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
          value={searchInput}
          maxLength={280}
          placeholder="Search for messages"
        ></input>
        <button
          className={
            search
              ? "mr-3 bg-sky-600 p-1 rounded flex items-center justify-center hover:bg-sky-700"
              : "mr-3 bg-red-500 p-1 rounded flex items-center justify-center hover:bg-red-700"
          }
          onClick={() => {
            SearchMessages();
          }}
        >
          <img
            src={search ? "/magnifier.png" : "/close.png"}
            className="w-7"
          ></img>
        </button>
      </div>
      <div className="bg-neutral-700 rounded w-11/12 max-w-md h-4/6 mt-3 overflow-y-scroll overflow-x-hidden scrollbar-hide flex flex-col">
        <div className="flex flex-col mr-3 ml-3 mt-2 mb-2">
          {RenderMessageList()}
        </div>
      </div>
      <div className="flex flex-row mb-3 mt-3 w-11/12 max-w-md items-center">
        <input
          type="text"
          className="rounded mr-3 w-11/12 p-1 bg-transparent text-neutral-100 border-neutral-700 border-2"
          onChange={(event) => {
            setTextInput(event.target.value);
          }}
          value={textInput}
          maxLength={280}
          onKeyDown={handleKeyPress}
        />
        <button
          className="bg-sky-600 p-1 mr-1 rounded flex items-center justify-center hover:bg-sky-700"
          onClick={() => {
            SendMessage();
          }}
        >
          <img src="/send.png" className="w-7"></img>
        </button>
        <button
          className={
            autoScroll
              ? "bg-orange-500 p-1 rounded flex items-center justify-center hover:bg-orange-700"
              : "bg-gray-600 p-1 rounded flex items-center justify-center hover:bg-gray-700"
          }
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

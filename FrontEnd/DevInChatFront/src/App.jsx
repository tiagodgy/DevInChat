import { sendMessage } from "@microsoft/signalr/dist/esm/Utils";
import { useState, useEffect, useRef } from "react";
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
  const saveConnection = useRef();
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

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

  function ConnectWebsocket() {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7023/chathub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("ReceiveMessage", (user, message) => {
      setMessages((messages) => [
        ...messages,
        { name: user, message: message },
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
    send();
    setTextInput("");
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
            <h3
              className={
                username == message.name
                  ? "text-sky-600 font-bold"
                  : "text-orange-500 font-bold"
              }
            >
              {message.name}:
            </h3>
            <p className="ml-2 text-neutral-100 flex-wrap break-all">
              {message.message}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  }

  useEffect(ConnectWebsocket, []);

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

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center w-full h-screen bg-neutral-800">
      <h1 className="text-neutral-100 text-3xl mt-3">DevInChat</h1>
      <h3 className="text-neutral-100 text-md mt-3 text-center max-w-md">
        Anonymously talk with people all over the world. Your current username
        is <span className="text-sky-600 font-bold"> {username}</span>. If the
        browser cache is wiped you will be assigned a new username.
      </h3>
      <div className="bg-neutral-700 rounded w-11/12 max-w-md h-4/6 mt-5 overflow-y-scroll overflow-x-hidden scrollbar-hide flex justify-center">
        {RenderMessageList()}
      </div>
      <div className="flex flex-row mt-3 mb-3 w-11/12 max-w-md items-center">
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

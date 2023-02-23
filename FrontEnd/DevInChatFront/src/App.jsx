import { useState } from "react";

function App() {
  const [username, setUsername] = useState("Tiago");
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center w-full h-screen bg-neutral-800">
      <h1 className="text-neutral-100 text-3xl mt-3">DevInChat</h1>
      <h3 className="text-neutral-100 text-xl mt-3">Username: {username}</h3>
    </div>
  );
}

export default App;

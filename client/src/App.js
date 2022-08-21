import { useRef, useState } from "react";

function App() {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState("");
    const socket = useRef();
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState("");

    async function sendMessage(event) {
        event.preventDefault();
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: "message"
        };

        socket.current.send(JSON.stringify(message));
        setValue("");
    }

    function connect(event) {
        event.preventDefault();
        socket.current = new WebSocket("ws://localhost:5000");

        socket.current.onopen = () => {
            setConnected(true);
            const message = {
                event: "connection",
                username,
                id: Date.now(),
                messages: `Connected ${username}`,
            };

            socket.current.send(JSON.stringify(message));
        };
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            setMessages((prev) => [message, ...prev]);
        };

        socket.current.onclose = () => {
            console.log("Socket close");
        };

        socket.current.onerror = () => {
            console.log("Error socket");
        };
    }

    return (
        <div className="container p-2">
            {!connected && (
                <form onSubmit={connect} className="text-center">
                    <h2 className="font-semibold">For enter in chat, write your name</h2>
                    <input
                        value={username}
                        className="border p-1 rounded"
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Enter you name..."
                    />
                    <button
                        type="submit"
                        className="border rounded bg-gray-500 p-1 ml-2">
                        Enter
                    </button>
                </form>
            )}
            {connected && (
                <>
                    <div>You login in chat som :{username}</div>
                    <article className="border rounded border-green-300 max-w-[250px] h-[90vh] mb-2 p-1">
                        {messages.map((mess) => (
                            <p key={mess.id}>
                                {mess.event === "connection" ? (
                                    <span>User {mess.username} connected!</span>
                                ) : (
                                    <span>
                                        {mess.username} :
                                        <span className="pl-2">
                                            {mess.message}
                                        </span>
                                    </span>
                                )}
                            </p>
                        ))}
                    </article>

                    <form onSubmit={sendMessage}>
                        <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="border rounded p-1"
                            type="text"></input>
                        <button
                            type="submit"
                            className="border rounded bg-gray-500 p-1 ml-2">
                            Send
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default App;

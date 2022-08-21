const ws = require("ws");

const wss = new ws.Server({ port: 5000 },
    () => console.log("Server started on port 5000")
);

wss.on("connection", function connection(ws) {
    ws.on("message", function (message) {
        message = JSON.parse(message);

        switch (message.event) {
            case "message":
                broadcastsMessage(message);
                break;
            case "connection":
                broadcastsMessage(message);
                break;

            default:
                break;
        }
    });
});

function broadcastsMessage(message, id) {
    wss.clients.forEach((client) => {
        client.send(JSON.stringify(message));
    });
}

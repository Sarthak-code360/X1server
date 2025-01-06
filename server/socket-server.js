const WebSocket = require("ws");

const PORT = 3000;

const server = new WebSocket.Server({ port: PORT });

server.on("connection", (socket) => {
    console.log("Client connected!");

    socket.on("message", (message) => {
        const time = new Date().toISOString();
        console.log(`Message: ${message} \tTime: ${time}`);

        // Respond to the client with a JSON object
        const response = {
            status: "success",
            message: `Data received on server: ${message}`,
            timestamp: time
        };
        socket.send(JSON.stringify(response)); // Send as JSON
    });

    socket.on("close", () => {
        console.log("Client disconnected!");
    });

    socket.on("error", (err) => {
        console.error("Error:", err.message);
    });
});

console.log(`WebSocket server running on ws:${PORT}`);

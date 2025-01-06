const WebSocket = require('ws');
let socket;

const connectToServer = () => {
    if (socket) {
        console.log("Already connected to the server.");
        return;
    }

    socket = new WebSocket('ws://localhost:3000');

    socket.on('open', () => {
        console.log("Connected to the WebSocket server on ws://localhost:3000");
    });

    socket.on('message', (data) => {
        console.log(`Message from server: ${data}`);
    });

    socket.on('close', () => {
        console.log("Disconnected from the WebSocket server.");
        socket = null;
    });

    socket.on('error', (error) => {
        console.error(`WebSocket error: ${error.message}`);
    });
};

const disconnectFromServer = () => {
    if (!socket) {
        console.log("No active connection to disconnect.");
        return;
    }
    socket.close();
};

module.exports = {
    connectToServer,
    disconnectFromServer,
};

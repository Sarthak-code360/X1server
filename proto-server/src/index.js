const { startServer, registerAppBroadcast } = require("./tcp/tcpServer");
const { startWebSocketServer } = require("./websocket/wsServer");

// Start TCP server
startServer();

// Start WebSocket server and connect it to the HW broadcast
startWebSocketServer((fullState) => {
    // This callback is invoked when the app sends data to HW
    registerAppBroadcast(fullState);
});

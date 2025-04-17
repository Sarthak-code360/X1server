// src/index.js
const { initServer, registerAppBroadcast } = require("./tcp/tcpServer");
const { startWebSocketServer } = require("./websocket/wsServer");

// Load proto, then start TCP server
initServer();

// Start WS server, wire up App → HW
startWebSocketServer(fullState => {
    registerAppBroadcast(fullState);
});

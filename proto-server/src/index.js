const { AppToHW, HWToApp } = require("./proto/compiled"); // Use precompiled types
const { initServer, registerAppBroadcast } = require("./tcp/tcpServer");
const { startWebSocketServer, getBroadcastToAppClients } = require("./websocket/wsServer");

// Start TCP server
initServer({ AppToHW, HWToApp }, ({ AppToHW }) => {
    // Start WebSocket Server
    startWebSocketServer({ AppToHW, HWToApp }, (fullState) => {
        if (globalThis.hwSocket) {
            const payload = AppToHW.encode(AppToHW.create(fullState)).finish();
            const framed = Buffer.concat([
                Buffer.from([0xaa, 0xbb]),
                payload,
                Buffer.from([0xcc]),
            ]);
            globalThis.hwSocket.write(framed);
            console.log("➡️ Sent to HW:", fullState);
        } else {
            console.warn("⚠️ No HW socket connected.");
        }
    });

    // Register HW -> App broadcast
    registerAppBroadcast(getBroadcastToAppClients());
});

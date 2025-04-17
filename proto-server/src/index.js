const protobuf = require("protobufjs");
const { initServer, registerAppBroadcast } = require("./tcp/tcpServer");
const { startWebSocketServer, getBroadcastToAppClients } = require("./websocket/wsServer");

protobuf.load("proto/messages.proto", (err, root) => {
    if (err) throw err;

    // Start TCP server
    initServer(root, ({ AppToHW }) => {
        // Start WS Server
        startWebSocketServer(root, (fullState) => {
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
});

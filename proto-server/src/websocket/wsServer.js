const WebSocket = require("ws");
const protobuf = require("protobufjs");
const { updateState } = require("../state/deviceState");

let broadcastToHW = null;
const clients = new Set(); // to keep all connected clients

function startWebSocketServer(broadcastToHW) {

    protobuf.load("proto/messages.proto", (err, root) => {
        if (err) throw err;

        const AppToHW = root.lookupType("AppToHW");
        const HWToApp = root.lookupType("HWToApp");

        const wss = new WebSocket.Server({ port: 4050 });

        wss.on("connection", ws => {
            console.log("📲 Mobile connected");
            clients.add(ws);

            ws.on("message", data => {
                try {
                    const decoded = AppToHW.decode(data);
                    console.log("📥 From App:", decoded);

                    const fullUpdate = updateState(decoded);
                    if (broadcastToHW) broadcastToHW(fullUpdate);
                } catch (err) {
                    console.error("❌ WS Decode error:", err.message);
                }
            });

            ws.on("close", () => {
                clients.delete(ws);
                console.log("📴 Mobile disconnected");
            });
        });

        // this method gets called by TCP server when HW sends data
        broadcastToAppClients = (msg) => {
            const payload = HWToApp.encode(HWToApp.create(msg)).finish();
            for (const client of clients) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(payload);
                }
            }
        };

        console.log("🌐 WebSocket server running on port 4050");
    });
}

module.exports = {
    startWebSocketServer,
    broadcastToAppClients,
};

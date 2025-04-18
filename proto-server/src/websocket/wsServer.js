const WebSocket = require("ws");
const { updateState } = require("../state/deviceState");

let broadcastToHW = null;
let broadcastToAppClients = null;
const clients = new Set();

function startWebSocketServer(types, sendToHWCallback) {
    const AppToHW = types.AppToHW;
    const HWToApp = types.HWToApp;

    broadcastToHW = sendToHWCallback;

    const wss = new WebSocket.Server({ port: 4050 });

    wss.on("connection", (ws) => {
        console.log("📲 Mobile connected");
        clients.add(ws);

        ws.on("message", (data) => {
            try {
                const decoded = AppToHW.decode(data);
                console.log("📥 From App:", decoded);

                const fullUpdate = updateState(decoded);
                if (broadcastToHW) {
                    broadcastToHW(fullUpdate);
                }
            } catch (err) {
                console.error("❌ WS Decode error:", err.message);
            }
        });

        ws.on("close", () => {
            clients.delete(ws);
            console.log("📴 Mobile disconnected");
        });
    });

    broadcastToAppClients = (msg) => {
        const payload = HWToApp.encode(HWToApp.create(msg)).finish();
        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        }
    };

    console.log("🌐 WebSocket server running on port 4050");
}

function getBroadcastToAppClients() {
    return broadcastToAppClients;
}

module.exports = {
    startWebSocketServer,
    getBroadcastToAppClients
};

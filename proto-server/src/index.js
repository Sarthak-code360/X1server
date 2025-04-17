const { initServer, registerAppBroadcast } = require("./tcp/tcpServer");
const { startWebSocketServer } = require("./websocket/wsServer");

function setup() {
    startWebSocketServer((fullState) => {
        // This gets called when the app sends a full state (AppToHW)
        if (globalThis.hwSocket) {
            const { AppToHW } = require("../proto/compiled"); // or however you have access to it
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

    // 👇 Register the reverse path: HW -> App
    registerAppBroadcast((hwDecodedState) => {
        const { broadcastToAppClients } = require("./websocket/wsServer");
        if (broadcastToAppClients) {
            broadcastToAppClients(hwDecodedState);
        } else {
            console.warn("⚠️ No broadcastToAppClients connected.");
        }
    });
}

initServer(setup);

const { initServer, registerAppBroadcast } = require("./tcp/tcpServer");
const { startWebSocketServer } = require("./websocket/wsServer");

let sendToHW;

function setup() {
    sendToHW = (state) => {
        if (globalThis.hwSocket) {
            const payload = AppToHW.encode(AppToHW.create(state)).finish();
            const framed = Buffer.concat([
                Buffer.from([0xaa, 0xbb]),
                payload,
                Buffer.from([0xcc])
            ]);
            globalThis.hwSocket.write(framed);
            console.log("➡️ Sent to HW:", state);
        }
    };

    registerAppBroadcast(sendToHW);
}

initServer(setup);
startWebSocketServer(sendToHW);

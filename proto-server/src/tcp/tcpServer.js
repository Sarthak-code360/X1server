// src/tcp/tcpServer.js
const net = require("net");
const protobuf = require("protobufjs");
const { updateState } = require("../state/deviceState");
const { broadcastToAppClients } = require("../websocket/wsServer");

const TCP_PORT = 3050;
let AppToHW, HWToApp;

function startServer() {
    const server = net.createServer(socket => {
        console.log("✅ HW connected");
        let buffer = Buffer.alloc(0);

        socket.on("data", chunk => {
            buffer = Buffer.concat([buffer, chunk]);
            while (true) {
                const start = buffer.indexOf(Buffer.from([0xaa, 0xbb]));
                const end = buffer.indexOf(Buffer.from([0xcc]), start);
                if (start < 0 || end < 0 || end <= start) break;

                const pkt = buffer.slice(start + 2, end); // exclude 0xaa, 0xbb and 0xcc
                buffer = buffer.slice(end + 1);

                try {
                    const msg = HWToApp.decode(pkt);
                    console.log("📥 From HW:", msg);
                    updateState(msg);
                    broadcastToAppClients(msg); // already encoded in wsServer
                } catch (e) {
                    console.error("❌ Decode error:", e.message);
                }
            }

        });

        socket.on("close", () => console.log("⛔ HW disconnected"));
        socket.on("error", e => console.error("⚠️ Socket error:", e.message));

        // Simulate app → HW
        setInterval(() => {
            const partial = { RPM_preset: 2500 };
            const full = updateState(partial);
            const payload = AppToHW.encode(AppToHW.create(full)).finish();
            const framed = Buffer.concat([
                Buffer.from([0xaa, 0xbb]),
                payload,
                Buffer.from([0xcc])
            ]);
            socket.write(framed);
            console.log("➡️ Sent to HW:", full);
        }, 5000);
    });

    server.listen(TCP_PORT, () => {
        console.log(`🚀 TCP server listening on ${TCP_PORT}`);
    });
}

function initServer() {
    protobuf.load("proto/messages.proto", (err, root) => {
        if (err) throw err;
        AppToHW = root.lookupType("AppToHW");
        HWToApp = root.lookupType("HWToApp");
        startServer();
    });
}

module.exports = {
    initServer,
    registerAppBroadcast: (fn) => { broadcastToAppClients = fn; }
};

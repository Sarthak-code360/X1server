const net = require("net");
const { updateState } = require("../state/deviceState");

const TCP_PORT = 3050;
let AppToHW, HWToApp;
let broadcastToAppClients = () => { };

function startServer() {
    const server = net.createServer(socket => {
        console.log("✅ HW connected");
        globalThis.hwSocket = socket;

        let buffer = Buffer.alloc(0);

        socket.on("data", chunk => {
            buffer = Buffer.concat([buffer, chunk]);

            while (true) {
                const start = buffer.indexOf(Buffer.from([0xaa, 0xbb]));
                const end = buffer.indexOf(Buffer.from([0xcc]), start);

                if (start < 0 || end < 0 || end <= start) break;

                const pkt = buffer.slice(start + 2, end);
                buffer = buffer.slice(end + 1);

                try {
                    const msg = HWToApp.decode(pkt);
                    console.log("📥 From HW:", msg);
                    updateState(msg);
                    broadcastToAppClients(msg);
                } catch (e) {
                    console.error("❌ Decode error:", e.message);
                }
            }
        });

        socket.on("close", () => {
            console.log("⛔ HW disconnected");
            globalThis.hwSocket = null;
        });

        socket.on("error", e => {
            console.error("⚠️ Socket error:", e.message);
        });
    });

    server.listen(TCP_PORT, () => {
        console.log(`🚀 TCP server listening on ${TCP_PORT}`);
    });

    server.on("error", err => {
        console.error("❌ TCP server error:", err);
    });
}

function initServer(types, afterInitCallback) {
    AppToHW = types.AppToHW;
    HWToApp = types.HWToApp;

    startServer();

    if (typeof afterInitCallback === "function") {
        afterInitCallback({ AppToHW, HWToApp });
    }
}

function registerAppBroadcast(fn) {
    broadcastToAppClients = fn;
}

module.exports = {
    initServer,
    registerAppBroadcast
};

const net = require("net");
const protobuf = require("protobufjs");
const { updateState } = require("../state/deviceState");

const TCP_PORT = 3050;

function startServer() {
    protobuf.load("proto/messages.proto", (err, root) => {
        if (err) throw err;

        const AppToHW = root.lookupType("AppToHW");
        const HWToApp = root.lookupType("HWToApp");

        const server = net.createServer(socket => {
            console.log("✅ HW connected");

            let buffer = Buffer.alloc(0);

            socket.on("data", chunk => {
                buffer = Buffer.concat([buffer, chunk]);

                while (true) {
                    const startIndex = buffer.indexOf(Buffer.from("aabb", "hex"));
                    const endIndex = buffer.indexOf(Buffer.from("cc", "hex"), startIndex);

                    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) break;

                    const packet = buffer.slice(startIndex + 2, endIndex);
                    buffer = buffer.slice(endIndex + 1);

                    try {
                        const message = HWToApp.decode(packet);
                        console.log("📥 From HW:", message);
                        // You can forward to app here if needed via WebSocket
                    } catch (e) {
                        console.error("❌ Decode error:", e.message);
                    }
                }
            });

            socket.on("close", () => {
                console.log("⛔ HW disconnected");
            });

            socket.on("error", err => {
                console.error("⚠️ Socket error:", err.message);
            });

            // Simulate app sending updates
            setInterval(() => {
                const partial = {
                    RPM_preset: 2500, // simulate app sending only RPM
                };

                const fullState = updateState(partial);
                const payload = AppToHW.encode(AppToHW.create(fullState)).finish();
                const framed = Buffer.concat([
                    Buffer.from("aabb", "hex"),
                    payload,
                    Buffer.from("cc", "hex")
                ]);
                socket.write(framed);
                console.log("➡️ Sent to HW:", fullState);
            }, 5000);
        });

        server.listen(TCP_PORT, () => {
            console.log(`🚀 Server listening on port ${TCP_PORT}`);
        });
    });
}

module.exports = {
    startServer,
};

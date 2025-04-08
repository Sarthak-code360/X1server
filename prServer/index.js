const protobuf = require('protobufjs');
const net = require('net');

const TCP_PORT = 3050;

protobuf.load("ServerProperties.proto", function (err, root) {
    if (err) throw err;

    const PropertySend = root.lookupType("PropertySend");
    const PropertyReceive = root.lookupType("PropertyReceive");

    const tcpserver = net.createServer(socket => {
        console.log('🔌 Hardware connected!');

        socket.on("data", chunk => {
            const startMarker = Buffer.from("aabb", "hex");
            const endMarker = Buffer.from("cc", "hex");

            const startIndex = chunk.indexOf(startMarker);
            const endIndex = chunk.indexOf(endMarker, startIndex + startMarker.length);

            if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                const packet = chunk.slice(startIndex + startMarker.length, endIndex);

                try {
                    const decoded = PropertySend.decode(packet);
                    console.log("Received from HW:", decoded);

                    // Prepare a response
                    const responseMessage = PropertyReceive.create({
                        Immobolize: false,
                        RPM_preset: 3000,
                        MotorType: true,
                    });

                    const encoded = PropertyReceive.encode(responseMessage).finish();

                    const framedResponse = Buffer.concat([
                        startMarker,
                        encoded,
                        endMarker
                    ]);

                    socket.write(framedResponse);
                    console.log("Sent response to HW:", responseMessage);
                } catch (e) {
                    console.error("Decode failed:", e.message);
                    console.log("Raw data:", packet.toString("hex"));
                }
            } else {
                console.warn("❗ Framing error: SOP or EOP not found");
            }
        });

        socket.on("close", () => console.log("Hardware disconnected"));
        socket.on("error", err => console.error("Socket error:", err.message));
    });

    tcpserver.listen(TCP_PORT, () => {
        console.log(`Server listening on port ${TCP_PORT}`);
    });
});

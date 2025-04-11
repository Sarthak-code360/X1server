const net = require('net');
const protobuf = require('protobufjs');

const TCP_PORT = 3050;

// Load proto file
protobuf.load("ServerProperties.proto", (err, root) => {
    if (err) throw err;

    const PropertySend = root.lookupType("PropertySend");
    const PropertyReceive = root.lookupType("PropertyReceive");

    const server = net.createServer(socket => {
        console.log("✅ Hardware connected!");

        let buffer = Buffer.alloc(0);

        socket.on("data", chunk => {
            buffer = Buffer.concat([buffer, chunk]);

            while (true) {
                const startIndex = buffer.indexOf(Buffer.from("aabb", "hex"));
                const endIndex = buffer.indexOf(Buffer.from("cc", "hex"), startIndex);

                if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) break;

                const packet = buffer.slice(startIndex + 2, endIndex);
                buffer = buffer.slice(endIndex + 1); // move buffer forward

                try {
                    const decoded = PropertySend.decode(packet);
                    console.log("Received from HW:", decoded);

                    // Create and send PropertyReceive response
                    const response = PropertyReceive.create({
                        MotorType: true,
                        Immobolize: false,
                        RPM_preset: 3,
                    });
                    console.log("RPM_preset:", response.RPM_preset);
                    // encode RPM_preset to hex
                    const hexRPM = response.RPM_preset.toString(16).padStart(4, '0');
                    console.log("Hex RPM_preset:", hexRPM);


                    console.log("Response to HW:", JSON.stringify(response)); // Show JSON output

                    const encoded = PropertyReceive.encode(response).finish();

                    console.log("Encoded response (hex):", encoded.toString("hex"));

                    const framed = Buffer.concat([
                        Buffer.from("aabb", "hex"),
                        encoded,
                        Buffer.from("cc", "hex")
                    ]);

                    socket.write(framed);

                } catch (e) {
                    console.error("❌ Decode error:", e.message);
                }
            }
        });

        socket.on("close", () => {
            console.log("Hardware disconnected");
        });

        socket.on("error", err => {
            console.error("⚠️ Socket error:", err.message);
        });
    });

    server.listen(TCP_PORT, () => {
        console.log(`Server listening on port ${TCP_PORT}`);
    });
});

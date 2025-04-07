const protobuf = require('protobufjs');
const fs = require('fs');
const net = require('net');

const TCP_PORT = 3050;

protobuf.load("ServerProperties.proto", function (err, root) {
    if (err) throw err;

    // Get the message type from proto file
    const PropertySend = root.lookupType("PropertySend");
    const PropertyReceive = root.lookupType("PropertyReceive");

    // Start TCP server
    const tcpserver = net.createServer(socket => {
        console.log('Hardware connected!');

        let buffer = Buffer.alloc(0);

        socket.on("data", chunk => {
            buffer = Buffer.concat([buffer, chunk]);

            // Check for SOP(aabb) and EOP(cc)
            const startIndex = buffer.indexOf(Buffer.from("aabb", "hex"));
            const endIndex = buffer.indexOf(Buffer.from("cc", "hex"), startIndex);

            if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                const packet = buffer.slice(startIndex + 2, endIndex); // Extract packet data
                buffer = buffer.slice(endIndex + 1); // Remove processed packet

                try {
                    const decoded = PropertySend.decode(packet);
                    console.log("Received data from HW:", decoded);

                    // Send a response back to the hardware
                    const responseMessage = PropertyReceive.create({
                        Immobolize: false,
                        RPM_preset: 3500,
                        MotorType: true,
                    });

                    const responseBuffer = PropertyReceive.encode(responseMessage).finish();

                    // Frame the response with SOP and EOP
                    const framedResponse = Buffer.concat([
                        Buffer.from("aabb", "hex"),
                        responseBuffer,
                        Buffer.from("cc", "hex")
                    ]);

                    socket.write(framedResponse);
                    console.log("Sent data to HW:", responseMessage);
                } catch (error) {
                    console.error("Decoding failed! Raw hex: ", packet.toString("hex"));
                    console.error("Error decoding packet:", error.message);
                }
            }
        });

        socket.on("close", () => {
            console.log("Hardware disconnected!");
        });
        socket.on("error", (err) => {
            console.error("Socket error:", err.message);
        });
    });

    tcpserver.listen(TCP_PORT, () => {
        console.log(`Server listening on port ${TCP_PORT}`);
    });
});
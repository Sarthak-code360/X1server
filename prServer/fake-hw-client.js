const net = require("net");
const protobuf = require("protobufjs");

const PORT = 3050;
const HOST = "localhost";

protobuf.load("ServerProperties.proto", (err, root) => {
    if (err) throw err;

    const PropertySend = root.lookupType("PropertySend");
    const PropertyReceive = root.lookupType("PropertyReceive");

    const socket = new net.Socket();

    socket.connect(PORT, HOST, () => {
        console.log("🔌 Connected to server");

        const message = PropertySend.create({
            Bus_Current: 12.5,
            RPM: 4200,
            Torque: 25,
            GPS: "12.9716,77.5946",
            GPS_size: 17,
            SOC: 75.4,
            Net_Strength: 4,
            Device_Temp: 45,
            Motor_Temp: 50,
            Bus_Voltage: 48.7,
            Throttle: 68.2
        });

        const encoded = PropertySend.encode(message).finish();

        const framed = Buffer.concat([
            Buffer.from("aabb", "hex"),
            encoded,
            Buffer.from("cc", "hex")
        ]);

        socket.write(framed);
        console.log("📤 Sent data to server:", message);
    });

    socket.on("data", data => {
        const startIndex = data.indexOf(Buffer.from("aabb", "hex"));
        const endIndex = data.indexOf(Buffer.from("cc", "hex"));

        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            const packet = data.slice(startIndex + 2, endIndex);

            try {
                const decoded = PropertyReceive.decode(packet);
                console.log("📥 Received from server:", decoded);
            } catch (err) {
                console.error("❌ Failed to decode server response:", err.message);
            }
        }
    });

    socket.on("close", () => {
        console.log("❌ Connection closed");
    });

    socket.on("error", (err) => {
        console.error("⚠️ Error:", err.message);
    });
});

const net = require("net");
const protobuf = require("protobufjs");

const PORT = 3050;
const HOST = "localhost";

protobuf.load("ServerProperties.proto", (err, root) => {
    if (err) throw err;

    const PropertySend = root.lookupType("PropertySend");
    const PropertyReceive = root.lookupType("PropertyReceive");

    const client = new net.Socket();

    client.connect(PORT, HOST, () => {
        console.log("📡 Connected to server");

        // Create PropertySend message
        const sendMsg = PropertySend.create({
            Bus_Current: 10.5,
            RPM: 4000,
            Torque: 20,
            GPS: "12.9716,77.5946",
            GPS_size: 17,
            SOC: 80.0,
            Net_Strength: 5,
            Device_Temp: 45,
            Motor_Temp: 50,
            Bus_Voltage: 48.5,
            Throttle: 70.5
        });

        const encoded = PropertySend.encode(sendMsg).finish();

        const framed = Buffer.concat([
            Buffer.from("aabb", "hex"),
            encoded,
            Buffer.from("cc", "hex")
        ]);

        client.write(framed);
        console.log("📤 Sent data to server:", sendMsg);
    });

    client.on("data", data => {
        console.log("📥 Raw response (hex):", data.toString("hex"));
        const startIndex = data.indexOf(Buffer.from("aabb", "hex"));
        const endIndex = data.indexOf(Buffer.from("cc", "hex"));

        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            const packet = data.slice(startIndex + 2, endIndex);

            try {
                const decoded = PropertyReceive.decode(packet);
                console.log("📥 Received from server:\n", JSON.stringify(decoded, null, 2));
                console.log("MotorType:", decoded.MotorType);
                console.log("Immobolize:", decoded.Immobolize);
                console.log("RPM_preset:", decoded.RPM_preset);
            } catch (err) {
                console.error("❌ Decode error (server response):", err.message);
            }
        }
    });

    client.on("error", err => {
        console.error("⚠️ Client error:", err.message);
    });

    client.on("close", () => {
        console.log("❌ Connection closed");
    });
});

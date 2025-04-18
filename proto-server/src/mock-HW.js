const net = require("net");
const protobuf = require("protobufjs");

const HOST = "localhost";// 13.232.19.209
const PORT = 3050;

protobuf.load("proto/messages.proto", (err, root) => {
    if (err) throw err;

    const AppToHW = root.lookupType("AppToHW");
    const HWToApp = root.lookupType("HWToApp");

    const client = new net.Socket();

    client.connect(PORT, HOST, () => {
        console.log("🔌 Connected to server as mock HW");

        // Send HW data every 3 seconds
        setInterval(() => {
            const gpsString = "12.34,56.78";
            const message = HWToApp.create({
                Bus_Current: +(Math.random() * 30).toFixed(2),
                RPM: Math.floor(Math.random() * 5000),
                Torque: +(Math.random() * 100).toFixed(2),
                GPS: gpsString,
                GPS_size: Buffer.byteLength(gpsString),
                SOC: Math.floor(Math.random() * 100),
                Net_Strength: Math.floor(Math.random() * 5),
                Device_Temp: +(45 + Math.random() * 10).toFixed(2),
                Motor_Temp: +(50 + Math.random() * 15).toFixed(2),
                Bus_Voltage: +(48 + Math.random() * 2).toFixed(2),
                Throttle: +(Math.random() * 100).toFixed(2)
            });

            const payload = HWToApp.encode(message).finish();
            const framed = Buffer.concat([
                Buffer.from("aabb", "hex"),
                payload,
                Buffer.from("cc", "hex")
            ]);

            client.write(framed);
            console.log(`[${new Date().toLocaleTimeString()}] 📤 Sent HW data to server`);
        }, 3000);
    });

    // Handle data from server (AppToHW)
    let buffer = Buffer.alloc(0);

    client.on("data", chunk => {
        buffer = Buffer.concat([buffer, chunk]);

        while (true) {
            const startIndex = buffer.indexOf(Buffer.from("aabb", "hex"));
            const endIndex = buffer.indexOf(Buffer.from("cc", "hex"), startIndex);

            if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) break;

            const packet = buffer.slice(startIndex + 2, endIndex);
            buffer = buffer.slice(endIndex + 1);

            try {
                const message = AppToHW.decode(packet);
                console.log(`[${new Date().toLocaleTimeString()}] 📥 Received command from App:`, message);
            } catch (e) {
                console.error("❌ Decode error on HW:", e.message);
            }
        }
    });

    client.on("close", () => {
        console.log("❌ Connection closed by server");
    });

    client.on("error", err => {
        console.error("⚠️ Socket error:", err.message);
    });
});

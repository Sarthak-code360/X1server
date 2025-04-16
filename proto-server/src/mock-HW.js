// mockHW.js
const net = require("net");
const protobuf = require("protobufjs");

protobuf.load("proto/messages.proto", (err, root) => {
    if (err) throw err;

    const HWToApp = root.lookupType("HWToApp");
    const client = net.createConnection({ port: 3050 }, () => {
        console.log("🛠️ Fake HW connected");

        setInterval(() => {
            const msg = HWToApp.create({
                batteryVoltage: 12000,
                speed: Math.floor(Math.random() * 100),
                gpsLocked: true,
                firmwareVersion: "v1.2.3"
            });
            const encoded = HWToApp.encode(msg).finish();
            const framed = Buffer.concat([
                Buffer.from("aabb", "hex"),
                encoded,
                Buffer.from("cc", "hex")
            ]);

            client.write(framed);
            console.log("🔋 Sent from HW");
        }, 3000);
    });
});

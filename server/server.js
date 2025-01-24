const { error } = require('console');
const net = require('net');
const { client } = require('netcat');
const WebSocket = require('ws');

const TCP_PORT = 3050;
const WS_PORT = 4050;

const DATA_TYPES = {
    1: "immobilize",
    2: "rpmPreset",
    3: "gps",
    4: "busCurrent",
    5: "busVoltage",
    6: "rpm",
    7: "deviceTemperature",
    8: "networkStrength",
    9: "torque",
    10: "SOC",
    11: "throttle",
    12: "motorTemperature",
};

// Store active connections
const hardwareConnections = new Set();
const WebSocketClients = new Set();

let immobilizationPacket = encodePacket(1, Buffer.from([0])); // Default 'unlock'
let rpmPresetPacket = encodePacket(2, Buffer.from([0])); // Default to 0

function decodePacket(buffer) {
    if (buffer.length < 5) {
        throw new Error('Invalid packet: Too short.');
    }
    if (buffer[0] !== 0xaa || buffer[1] !== 0xbb) {
        throw new Error('Invalid header: Does not match 0xAA 0xBB.');
    }

    const typeCode = buffer[2];
    const length = buffer[3];
    const payload = buffer.slice(4, 4 + length);

    const checksum = buffer[length + 1];
    // const expectedChecksum = buffer.slice(0, 4 + length).reduce((acc, byte) => acc ^ byte, 0);
    // if (expectedChecksum !== checksum) {
    //     throw new Error('Checksum validation failed!');
    // }
    return { dataType: DATA_TYPES[typeCode] || "unknown", payload };
}

function encodePacket(index, payload) {
    const bufferSize = 4 + payload.length + 1;
    const buffer = Buffer.alloc(bufferSize);

    buffer.writeUInt8(0xaa, 0);
    buffer.writeUInt8(0xbb, 1);
    buffer.writeUInt8(index, 2);
    buffer.writeUInt8(payload.length, 3);
    Buffer.from(payload).copy(buffer, 4);

    const checksum = buffer.slice(0, 4 + payload.length).reduce((acc, byte) => acc ^ byte, 0);
    buffer.writeUInt8(checksum, 4 + payload.length);

    // console.log('Encoded Packet:', buffer);
    return buffer;
}

// TCP Server for HW
const tcpserver = net.createServer((socket) => {
    console.log('Hardware connected!', socket.remoteAddress);
    hardwareConnections.add(socket);

    // socket.write(("Hello").toString('utf-8'));

    // Receiving Process
    socket.on('data', (data) => {
        try {
            // console.log('\nRaw Data received:', data);

            const { dataType, payload } = decodePacket(data);

            console.log(`Decoded Data Type: ${dataType}`);
            console.log(`Payload: ${payload.toString('hex')}`);

            //Broadcast received data to app
            const message = { dataType, payload: payload.toString('hex') };
            broadcast(message);

        } catch (error) {
            console.error('Error decoding packet:', error.message);
        }
    });

    // Sending Process (independent) from Server to HW
    const sendInterval = setInterval(() => {
        try {
            // Send packets to hardware
            socket.write(immobilizationPacket);
            socket.write(rpmPresetPacket);
            console.log(`Sent Immobilization Packet: ${immobilizationPacket}`);
            console.log(`Sent RPM preset Packet: ${rpmPresetPacket}`);

        } catch (error) {
            console.error('Error sending data:', error.message);
        }
    }, 2);

    socket.on('end', () => {
        console.log('Hardware disconnected!');
        clearInterval(sendInterval); // Clear interval when client disconnects
        hardwareConnections.delete(socket);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error.message);
        clearInterval(sendInterval);
        hardwareConnections.delete(socket);
    });
});

tcpserver.listen(TCP_PORT, () => {
    console.log(`Server listening on port ${TCP_PORT}`);
});


// WebSocket Server for Mobile App
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', ws => {
    console.log('Mobile App connected!');
    WebSocketClients.add(ws);

    // Send acknowledgment message
    ws.send(JSON.stringify({ message: 'Connection established with WebSocket server on port 4050.' }));

    ws.on("message", (message) => {
        console.log("Received message from Mobile App:", message);
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
        } catch (error) {
            console.error("Error parsing message:", error);
            return;
        }

        const { dataType, value } = parsedMessage;
        let encodedPacket;

        switch (dataType) {
            case "immobilize":
                console.log(`Updated immobilization value: ${value}`);
                immobilizationPacket = encodePacket(1, Buffer.from([value]));
                console.log('New Immobilization Packet:', immobilizationPacket.toString('hex'));
                break;

            case "rpmPreset":
                console.log(`Updated RPM preset value: ${value}`);
                rpmPresetPacket = encodePacket(2, Buffer.from([value]));
                console.log('New RPM Packet:', rpmPresetPacket.toString('hex'));
                break;

            default:
                console.error(`Unknown data type: ${dataType}`);
                return;
        }

        // Send the encoded packet to all HW (tcp-server) connections
        hardwareConnections.forEach((socket) => {
            try {
                socket.write(encodedPacket);
                console.log(`Sent packet to hardware: ${encodedPacket.toString('hex')}`);
            } catch (error) {
                console.error("Error sending data to hardware:", error.message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Mobile App disconnected!');
        WebSocketClients.delete(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error.message);
        WebSocketClients.delete(ws);
    });
});


// Broadcast to Mobile
function broadcast(message) {
    const jsonMessage = JSON.stringify(message);

    WebSocketClients.forEach((client) => {
        if (client.readyState == WebSocket.OPEN) {
            client.send(jsonMessage);
        }
    });
}
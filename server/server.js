const net = require('net');
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
    13: "motorType",
};

// Store active connections
const hardwareConnections = new Set();
const WebSocketClients = new Set();

let immobilizationPacket = encodePacket(1, Buffer.from([0])); // Default 'unlock'
let rpmPresetPacket = encodePacket(2, Buffer.from([0])); // Default to 0
let motorTypePacket = encodePacket(13, Buffer.from([0])); // Default to 0

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

    const checksum = buffer[length + 4];

    // Validate end-of-packet marker
    if (typeCode !== 3 && buffer[5 + length] !== 0xcc) {
        throw new Error('Invalid packet: Missing end-of-packet marker (0xCC).');
    }

    return { dataType: DATA_TYPES[typeCode] || "unknown", payload };
}

function encodePacket(index, payload) {
    // Determine the correct length based on the index
    let payloadLength;
    if (index === 1) {
        payloadLength = 1;
    } else if (index === 2) {
        payloadLength = 2;
    } else {
        payloadLength = payload.length;
    }

    const bufferSize = 4 + payloadLength + 1; // Header (4) + Payload + Checksum (1)
    const buffer = Buffer.alloc(bufferSize);

    // Write fixed header
    buffer.writeUInt8(0xaa, 0);
    buffer.writeUInt8(0xbb, 1);
    buffer.writeUInt8(index, 2);
    buffer.writeUInt8(payloadLength, 3);

    // Copy the payload into the buffer
    Buffer.from(payload).copy(buffer, 4);

    // Calculate and write checksum
    const checksum = buffer.slice(0, 4 + payloadLength).reduce((acc, byte) => acc ^ byte, 0);
    buffer.writeUInt8(checksum, 4 + payloadLength);

    return buffer;
}

function processGPSData(gpsString) {
    const [gpsLat, gpsLongRaw] = gpsString.split(',').map(value => value.trim());
    if (!gpsLat || !gpsLongRaw) {
        console.error(`Invalid GPS data: ${gpsString}`);
        return null;
    }
    // Remove non-numeric and non-decimal characters from gpsLong
    const gpsLong = gpsLongRaw.match(/-?\d+\.\d+/)?.[0] || '';

    return { gpsLat, gpsLong };
}

function convertHexToDecimal(payload) {
    if (!Buffer.isBuffer(payload) || payload.length !== 2) {
        console.error("Invalid payload length for conversion", payload);
        return null;
    }
    if (payload[0] === 0xDD) {
        const firstByte = 0;
        const secondByte = payload.readUInt8(1);

        return `${firstByte}.${secondByte}`;
    }
    else {
        const firstByte = payload.readUInt8(0);  // Extract first byte as decimal
        const secondByte = payload.readUInt8(1); // Extract second byte as decimal

        return `${firstByte}.${secondByte}`; // Combine with decimal point
    }
}


// TCP Server for HW
const tcpserver = net.createServer((socket) => {
    console.log('Hardware connected!', socket.remoteAddress);
    hardwareConnections.add(socket);

    const latestDataBuffer = {}; // Stores the latest values of each data type

    // Receiving Process
    socket.on('data', (data) => {
        try {
            console.log('Received packet:', data.toString('hex')); // HW data packet

            //CLI JSON
            console.log('Received Raw JSON:', data.toString());


            const { dataType, payload } = decodePacket(data);

            console.log(`Decoded Data Type: ${dataType}`);
            console.log(`Payload: ${payload.toString('hex')}`);

            let processedPayload;

            if (["busCurrent", "throttle", "SOC", "busVoltage"].includes(dataType)) {
                processedPayload = convertHexToDecimal(payload);
            } else if (payload.length === 1) {
                if (payload === 0xDD) {
                    processedPayload = 0;
                } else {
                    processedPayload = payload.readUInt8(); // Convert 1byte to decimal
                }
            } else if (payload.length === 2) {
                if (payload[0] === 0xDD) {
                    processedPayload = payload[1].readUInt8();
                } else {
                    processedPayload = payload.readUInt16BE();
                }
            } else {
                processedPayload = payload.toString('hex');
            }

            console.log(`Processed Payload: ${processedPayload}`);

            if (dataType === "gps") {
                const gpsData = processGPSData(payload.toString());
                if (gpsData) {
                    console.log("GPS Data:", gpsData);
                    broadcast({ dataType, ...gpsData });
                } else {
                    console.error("Invalid GPS data received.");
                }
            } else {
                latestDataBuffer[dataType] = processedPayload;
            }
        } catch (error) {
            console.error('Error decoding packet:', error.message);
        }
    });

    const sendToAppInterval = setInterval(() => {
        if (Object.keys(latestDataBuffer).length > 0) {
            broadcast(latestDataBuffer);
            // console.log("Sent buffered data to mobile app:", latestDataBuffer);
        }
    }, 1000);

    socket.on('end', () => {
        console.log('Hardware disconnected!');
        clearInterval(sendHWInterval);
        clearInterval(sendToAppInterval);
        hardwareConnections.delete(socket);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error.message);
        clearInterval(sendHWInterval);
        clearInterval(sendToAppInterval);
        hardwareConnections.delete(socket);
    });
});

tcpserver.listen(TCP_PORT, () => {
    console.log(`Server listening on port ${TCP_PORT}`);
});

// WebSocket Server for Mobile App
const wss = new WebSocket.Server({ port: WS_PORT });

const sendHWInterval = setInterval(() => {
    hardwareConnections.forEach((socket) => {
        try {
            socket.write(immobilizationPacket);
            socket.write(rpmPresetPacket);
            socket.write(motorTypePacket);
        } catch (error) {
            console.error('Error sending data to HW:', error.message);
        }
    });
}, 5);

wss.on('connection', ws => {
    console.log('Mobile App connected!', ws._socket.remoteAddress);
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
        if (!dataType || value === undefined) {
            console.error("Invalid message format.");
            return;
        }

        // Convert value to HEX buffer with proper size
        const valueBuffer = value > 255
            ? Buffer.from([(value >> 8) & 0xff, value & 0xff]) // Multi-byte value (Big Endian)
            : Buffer.from([value]); // Single-byte value

        let encodedPacket;
        try {
            switch (dataType) {
                case "immobilize":
                    console.log(`Updated immobilization value: ${value}`);
                    immobilizationPacket = encodePacket(1, valueBuffer);
                    encodedPacket = immobilizationPacket;
                    console.log('New Immobilization Packet:', immobilizationPacket.toString('hex'));
                    break;

                case "rpmPreset":
                    console.log(`Updated RPM preset value: ${value}`);
                    rpmPresetPacket = encodePacket(2, valueBuffer);
                    encodedPacket = rpmPresetPacket;
                    console.log('New RPM Packet:', rpmPresetPacket.toString('hex'));
                    break;

                case "motorType":
                    console.log(`Updated Motor Type value: ${value}`);
                    motorTypePacket = encodePacket(13, valueBuffer);
                    encodedPacket = motorTypePacket;
                    console.log('New Motor Type Packet:', encodedPacket.toString('hex'));
                    break;

                default:
                    console.error(`Unknown data type: ${dataType}`);
                    return;
            }
        } catch (err) {
            console.error("Error encoding packet:", err.message);
            return;
        }

        if (!encodedPacket) {
            console.error("No packet to send. Skipping hardware communication.");
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
        } else {
            WebSocketClients.delete(client);
        }
    });
}

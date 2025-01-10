const net = require('net');
const WebSocket = require('ws');

const TCP_PORT = 3000;
const WS_PORT = 4000;

const DATA_TYPES = {
    1: "immobilize",
    2: "rpm preset",
    3: "gps",
    4: "current",
    5: "voltage",
    6: "rpm",
    7: "temperature",
    8: "network strength",
};

// Store active connections
const hardwareConnections = new Set();
const WebSocketClients = new Set();

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
    const checksum = buffer[length + 1]; // Logic needed to be updated

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

    console.log('Encoded Packet:', buffer);
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
            console.log('\nRaw Data received:', data);

            const { dataType, payload } = decodePacket(data);

            console.log(`Decoded Data Type: ${dataType}`);
            console.log(`Payload: ${payload.toString('hex')}`);

        } catch (error) {
            console.error('Error decoding packet:', error.message);
        }
    });

    // Sending Process (independent)
    const sendInterval = setInterval(() => {
        try {
            const sendPacket1 = encodePacket(1, Buffer.from([0x02]));
            const sendPacket2 = encodePacket(2, Buffer.from([0x20]));

            socket.write(sendPacket1);
            socket.write(sendPacket2);

            console.log('Sent data to client:');
            // console.log('Immobilize Data:', sendPacket1);
            // console.log('RPM Data:', sendPacket2);
        } catch (error) {
            console.error('Error sending data:', error.message);
        }
    }, 2);

    socket.on('end', () => {
        console.log('Client disconnected!');
        clearInterval(sendInterval); // Clear interval when client disconnects
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error.message);
        clearInterval(sendInterval);
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
})
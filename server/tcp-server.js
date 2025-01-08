const net = require('net');

const PORT = 3000;

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

// function calculateChecksum(data) {
//     return data.reduce((checksum, byte) => checksum ^ byte, 0);
// }

// Decode
function decodePacket(buffer) {
    if (buffer.length < 5) {
        throw new Error('Invalid packet: Too short.');
    }

    // Validate the header
    if (buffer[0] !== 0xaa || buffer[1] !== 0xbb) {
        throw new Error('Invalid header: Does not match 0xAA 0xBB.');
    }
    const typeCode = buffer[2]; // Type field
    const length = buffer[3]; // Length field
    const payload = buffer.slice(4, 4 + length); // Payload field
    const checksum = buffer[length + 1]; // Checksum field

    // Verify checksum
    // const calculatedChecksum = calculateChecksum(checksum);
    // if (checksum !== calculatedChecksum) {
    //     throw new Error(`Invalid checksum. Expected: 0x${calculatedChecksum.toString(16)}, Received: 0x${checksum.toString(16)}`);
    // }

    // Identify the data type
    const dataType = DATA_TYPES[typeCode];
    if (!dataType) {
        throw new Error(`Unknown data type: ${typeCode}`);
    }

    return { dataType, payload };
}

// Encode
function encodePacket(index, payload) {
    // Calculate the total buffer size
    const bufferSize = 4 + payload.length + 1; // Header (2) + Type (1) + Length (1) + Payload + Checksum
    const buffer = Buffer.alloc(bufferSize);

    // Write the header
    buffer.writeUInt8(0xaa, 0); // Header byte 1
    buffer.writeUInt8(0xbb, 1); // Header byte 2

    // Write the type (index)
    buffer.writeUInt8(index, 2); // Type field

    // Write the length of the payload
    buffer.writeUInt8(payload.length, 3); // Length field

    // Write the payload
    Buffer.from(payload).copy(buffer, 4); // Payload field

    // Calculate the checksum (XOR of all previous bytes)
    const checksum = buffer.slice(0, 4 + payload.length).reduce((acc, byte) => acc ^ byte, 0);

    // Write the checksum
    buffer.writeUInt8(checksum, 4 + payload.length); // Checksum field

    console.log('Encoded Packet:', buffer);

    return buffer;
}


function logger(dataType, payload) {
    switch (dataType) {
        case 'immobilize':
            console.log('Immobilize:', payload.toString('hex'));
            break;
        case 'rpm preset':
            console.log('RPM Preset:', payload.toString('hex'));
            break;
        case 'gps':
            console.log('GPS:', payload.toString('hex'));
            break;
        case 'current':
            console.log('Current:', payload.toString('hex'));
            break;
        case 'voltage':
            console.log('Voltage:', payload.toString('hex'));
            break;
        case 'rpm':
            console.log('RPM:', payload.toString('hex'));
            break;
        case 'temperature':
            console.log('Temperature:', payload.toString('hex'));
            break;
        case 'network strength':
            console.log('Network Strength:', payload.toString('hex'));
            break;
        default:
            console.log('Unknown data type:', dataType);
    }
}

const server = net.createServer((socket) => {
    console.log('Client connected!', socket.remoteAddress);
    socket.write(("Hello").toString('utf-8'));

    socket.on('data', (data) => {
        try {
            console.log('\nRaw Data received:', data);

            // const buffer = Buffer.from(data); // use raw data as buffer
            const time = new Date().toISOString();

            // Decode the packet
            const { dataType, payload } = decodePacket(data);

            console.log(`Decoded Data Type: ${dataType}`);
            console.log(`Payload: ${payload.toString('hex')}`);
            console.log(`Time Received: ${time}`);

            // Store or log the data (extend this as needed)
            // console.log(`Storing data for ${dataType}:`, payload.toString('hex'));
            logger(dataType, payload);

            const sendpacket = Buffer.from([0x02]); // Correctly formatted buffer
            const sendpacket1 = Buffer.from([0x20]);

            console.log('Sending data to client...');
            socket.write(encodePacket(1, sendpacket));
            socket.write(encodePacket(2, sendpacket1));


            console.log('Immobilize Data sent to client:', sendpacket);
            console.log('RPM Data sent to client:', sendpacket1);


            // Send acknowledgment back to the hardware
            const responseMessage = `Data for ${dataType} received at ${time}`;
            // socket.write(responseMessage);
            console.log('Acknowledgment sent to client:', responseMessage);

        } catch (error) {
            console.error('Error in main function:', error.message);
            socket.write(`Error: ${error.message}`);
        }
    });

    socket.on('end', () => {
        console.log('Client disconnected!');
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error.message);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
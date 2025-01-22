const inquirer = require('inquirer');
const WebSocket = require('ws');

let ws;

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

// Packet encoding function
function encodePacket(index, payload) {
    const bufferSize = 4 + payload.length + 1;
    const buffer = Buffer.alloc(bufferSize);

    buffer.writeUInt8(0xaa, 0); // Header byte 1
    buffer.writeUInt8(0xbb, 1); // Header byte 2
    buffer.writeUInt8(index, 2); // Data type index
    buffer.writeUInt8(payload.length, 3); // Payload length
    Buffer.from(payload).copy(buffer, 4); // Payload

    const checksum = buffer.slice(0, 4 + payload.length).reduce((acc, byte) => acc ^ byte, 0);
    buffer.writeUInt8(checksum, 4 + payload.length); // Checksum
    return buffer;
}

// Packet decoding function
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

    const checksum = buffer[4 + length];
    const calculatedChecksum = buffer.slice(0, 4 + length).reduce((acc, byte) => acc ^ byte, 0);

    if (checksum !== calculatedChecksum) {
        throw new Error('Checksum validation failed!');
    }

    return { dataType: DATA_TYPES[typeCode] || "unknown", payload: payload.toString() };
}

// Main CLI menu
async function mainMenu() {
    console.log('\nWelcome to the Mazout CLI Tool\n');
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose an action:',
            choices: ws && ws.readyState === WebSocket.OPEN ? ['Send Data', 'Disconnect', 'Exit'] : ['Connect', 'Exit'],
        },
    ]);

    switch (action) {
        case 'Connect':
            connectToServer();
            break;
        case 'Disconnect':
            disconnectFromServer();
            break;
        case 'Send Data':
            sendDataMenu();
            break;
        case 'Exit':
            process.exit();
            break;
        default:
            console.log('Invalid choice.');
            mainMenu();
    }
}

// Connect to WebSocket server
function connectToServer() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('Already connected to the server.');
        return;
    }

    ws = new WebSocket('ws://13.232.19.209:3050'); // act as HW

    ws.on('open', () => {
        console.log('Connected to the WebSocket server.');
        mainMenu();
    });

    ws.on('message', (data) => {
        try {
            const decoded = decodePacket(Buffer.from(data));
            console.log('\nReceived from server (decoded):', decoded);
        } catch (error) {
            console.error('Error decoding server message:', error.message);
        }
    });

    ws.on('close', () => {
        console.log('Disconnected from server.');
        mainMenu();
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error.message);
    });
}

// Disconnect from WebSocket server
function disconnectFromServer() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    } else {
        console.log('Not connected to the server.');
    }
}

// Send data to the server
async function sendDataMenu() {
    const { typeCode } = await inquirer.prompt([
        {
            type: 'list',
            name: 'typeCode',
            message: 'Select a data type to send:',
            choices: Object.keys(DATA_TYPES).map((key) => ({
                name: `${DATA_TYPES[key]} (${key})`,
                value: parseInt(key, 10),
            })),
        },
    ]);

    const { value } = await inquirer.prompt([
        {
            type: 'input',
            name: 'value',
            message: `Enter the value for ${DATA_TYPES[typeCode]}:`,
            validate: (input) => !isNaN(input) && input !== '' ? true : 'Please enter a valid number.',
        },
    ]);

    const payload = Buffer.from([parseInt(value, 10)]);
    const encodedPacket = encodePacket(typeCode, payload);

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(encodedPacket);
        console.log(`\nSent to server:`, encodedPacket.toString('hex'));
    } else {
        console.log('Unable to send data. Not connected to the server.');
    }

    mainMenu();
}

mainMenu();

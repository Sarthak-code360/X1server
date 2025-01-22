const inquirer = require('inquirer');
const WebSocket = require('ws');

// Store the WebSocket connection
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

// Function to encode packets
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

    return buffer;
}

async function mainMenu() {
    console.log('\nWelcome to the Mazout CLI tool\n');
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose an action:',
            choices: ws && ws.readyState === WebSocket.OPEN ? ['Select Properties', 'Disconnect', 'Exit'] : ['Connect', 'Exit'],
        },
    ]);

    console.log(`You choose to: ${action}`);

    switch (action) {
        case 'Connect':
            connectToServer();
            break;
        case 'Disconnect':
            disconnectFromServer();
            break;
        case 'Exit':
            process.exit();
            break;
        case 'Select Properties':
            selectProperties();
            break;
        default:
            console.log("Invalid option, please choose again.");
            mainMenu();
    }
}

// Function to connect to the WebSocket server
function connectToServer() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('Already connected to the server.');
        return;
    }

    ws = new WebSocket('ws://13.233.25.158:3050'); //13.233.25.158

    ws.on('open', () => {
        console.log('Connected to the server');
        mainMenu();
    });

    ws.on('message', (data) => {
        const message = data.toString('utf8');
        try {
            const jsonResponse = JSON.parse(message);
            console.log('\nReceived from server:', jsonResponse);
        } catch (error) {
            console.error('Error parsing server response:', error);
        }
    });

    ws.on('close', () => {
        console.log('Disconnected from server');
        mainMenu();
    });

    ws.on('error', (error) => {
        console.error('Error:', error);
    });
}

function disconnectFromServer() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    } else {
        console.log('Not connected to the server.');
    }
}

async function selectProperties() {
    const { property } = await inquirer.prompt([
        {
            type: 'list',
            name: 'property',
            message: 'Select a property to configure:',
            choices: [
                ...Object.values(DATA_TYPES),
                'Back to Main Menu'
            ],
        },
    ]);

    if (property === 'Back to Main Menu') {
        mainMenu();
    } else {
        await enterValue(property);
    }
}

// Enter value for the selected property
async function enterValue(property) {
    const index = Object.keys(DATA_TYPES).find((key) => DATA_TYPES[key] === property);

    if (!index) {
        console.log('Invalid property selected.');
        return selectProperties();
    }

    const { value } = await inquirer.prompt([
        {
            type: 'input',
            name: 'value',
            message: `Enter value for ${property}:`,
            validate: (input) => !isNaN(input) && input !== '' ? true : 'Please enter a valid number.',
        },
    ]);

    console.log(`Encoding and sending value: ${value} for ${property} to the server...`);

    // Encode the data and send to the server
    const encodedData = encodePacket(parseInt(index), value.toString());
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(encodedData);
        console.log(`Encoded data sent: ${encodedData.toString('hex')}`);
    } else {
        console.log('Unable to send value, not connected to the server.');
    }
    selectProperties();
}

mainMenu();

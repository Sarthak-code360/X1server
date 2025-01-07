const inquirer = require('inquirer');
const WebSocket = require('ws');

// Store the WebSocket connection
let ws;

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

    console.log(`You chose to: ${action}`);

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

    ws = new WebSocket('ws://13.233.25.158:3000'); //13.233.25.158

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
                'Immobilize',
                'RPM Preset',
                'GPS',
                'Current',
                'Voltage',
                'RPM',
                'Temperature',
                'Network Strength',
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

async function enterValue(property) {
    const { value } = await inquirer.prompt([
        {
            type: 'input',
            name: 'value',
            message: `Enter value for ${property}:`,
            validate: (input) => !isNaN(input) && input !== '' ? true : 'Please enter a valid number.',
        },
    ]);

    console.log(`Sending value: ${value} for ${property} to the server...`);

    // Send the value to the server
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ property, value }));
        console.log(`Value sent: ${value} for ${property}`);
    } else {
        console.log('Unable to send value, not connected to the server.');
    }
    selectProperties();
}

mainMenu();

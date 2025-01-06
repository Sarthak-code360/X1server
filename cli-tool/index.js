const inquirer = require('inquirer');
const WebSocket = require('ws');

// Store the WebSocket connection
let ws;

async function mainMenu() {
    // Display the menu and capture user input
    console.log('\nWelcome to the Mazout CLI tool\n');
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose an action:',
            choices: ['Connect', 'Disconnect', 'Exit'],
        },
    ]);

    console.log(`You chose to: ${action}`);

    // Handle user action
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

    ws = new WebSocket('ws://localhost:3000'); // Connect to the WebSocket server

    ws.on('open', () => {
        console.log('Connected to the server');
        mainMenu(); // Prompt for the next action
    });

    ws.on('message', (data) => {
        console.log('Received from server:', data);
    });

    ws.on('close', () => {
        console.log('Disconnected from server');
        mainMenu(); // Prompt for the next action
    });

    ws.on('error', (error) => {
        console.error('Error:', error);
    });
}

// Function to disconnect from the WebSocket server
function disconnectFromServer() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    } else {
        console.log('Not connected to the server.');
    }
}

// Start the CLI tool and show the menu
mainMenu();

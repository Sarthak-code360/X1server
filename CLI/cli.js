#!/usr/bin/env node

const { Command } = require('commander');
const axios = require('axios');
const readline = require('readline');

const program = new Command();

// Helper to get user input
const promptUserInput = (questions) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answers = {};
    const askQuestion = (index = 0) => {
        if (index === questions.length) {
            rl.close();
            return Promise.resolve(answers);
        }

        const { name, question } = questions[index];
        return new Promise((resolve) =>
            rl.question(`${question}: `, (input) => {
                answers[name] = input;
                resolve(askQuestion(index + 1));
            })
        );
    };

    return askQuestion();
};

// Commands for app endpoints
program
    .command('app-fetch <endpoint>')
    .description('Fetch data from the app endpoint')
    .action(async (endpoint) => {
        console.log(`Fetching data from /${endpoint}...`);
        try {
            const response = await axios.get(`https://your-server-url/${endpoint}`);
            console.log('Data received from server:', response.data);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    });

program
    .command('app-send <endpoint>')
    .description('Send data to the app endpoint')
    .action(async (endpoint) => {
        const inputQuestions =
            endpoint === 'app-immobilize-data'
                ? [
                    { name: 'immobilizeStatus', question: 'Enter immobilize status' },
                ]
                : [
                    { name: 'rpm', question: 'Enter RPM' },
                ];

        const inputData = await promptUserInput(inputQuestions);

        console.log(`Sending data to /${endpoint}...`);
        console.log('Data to send:', inputData);
        try {
            const response = await axios.post(
                `https://your-server-url/${endpoint}`,
                inputData
            );
            console.log('Response from server:', response.data);
        } catch (error) {
            console.error('Error sending data:', error.message);
        }
    });

// Commands for hardware communication
program
    .command('hw-fetch')
    .description('Fetch data sent from hardware to server')
    .action(async () => {
        console.log('Fetching data from /device-data...');
        try {
            const response = await axios.get(`https://your-server-url/device-data`);
            console.log('Data received from hardware:', response.data);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    });

program
    .command('hw-send <endpoint>')
    .description('Send data from server to hardware')
    .action(async (endpoint) => {
        const inputQuestions = [
            { name: 'gpsCoordinates', question: 'Enter GPS coordinates' },
            { name: 'signature', question: 'Enter signature' },
            { name: 'rpm', question: 'Enter RPM' },
            { name: 'immobilizeStatus', question: 'Enter immobilize status' },
            { name: 'current', question: 'Enter current' },
            { name: 'voltage', question: 'Enter voltage' },
            { name: 'temperature', question: 'Enter temperature' },
        ];

        const inputData = await promptUserInput(inputQuestions);

        console.log(`Sending data to /${endpoint}...`);
        console.log('Data to send:', inputData);
        try {
            const response = await axios.post(
                `https://your-server-url/${endpoint}`,
                inputData
            );
            console.log('Response from server:', response.data);
        } catch (error) {
            console.error('Error sending data:', error.message);
        }
    });

program.parse(process.argv);

#!/usr/bin/env node

const { mainMenu } = require('./Inquirer/cliHandler');

(async () => {
    console.log("Welcome to the Mazout CLI Tool!");
    await mainMenu();
})();

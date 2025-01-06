const chalk = require('chalk');

const logSuccess = (message) => console.log(chalk.green(message));
const logError = (message) => console.error(chalk.red(message));
const logInfo = (message) => console.log(chalk.blue(message));

module.exports = { logSuccess, logError, logInfo };

import { Command } from "commander";
import WebSocket from "ws";
import chalk from "chalk";

const program = new Command();
let ws;

const connectToServer = () => {
    console.log(chalk.blue("Attempting to connect to the WebSocket server..."));
    ws = new WebSocket("ws://localhost:3000");

    ws.on("open", () => {
        console.log(chalk.green("Connected to the WebSocket server."));
    });

    ws.on("message", (data) => {
        console.log(chalk.yellow(`Message from server: ${data}`));
    });

    ws.on("close", () => {
        console.log(chalk.red("Disconnected from the WebSocket server."));
    });

    ws.on("error", (err) => {
        console.error(chalk.red(`WebSocket error: ${err.message}`));
    });
};

const disconnectFromServer = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
        console.log(chalk.green("Disconnected from the WebSocket server."));
    } else {
        console.log(chalk.red("No active WebSocket connection to disconnect."));
    }
};

program
    .command("connect")
    .description("Connect to the WebSocket server.")
    .action(() => {
        connectToServer();
    });

program
    .command("disconnect")
    .description("Disconnect from the WebSocket server.")
    .action(() => {
        disconnectFromServer();
    });

program.parse(process.argv);

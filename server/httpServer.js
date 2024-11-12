// server/httpServer.js
const express = require("express");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "proto", "data.proto");

// contains the definitions from data.proto in a format grpc
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});

// contains the structure of the DataService and its methods (SendData)
const dataProto = grpc.loadPackageDefinition(packageDefinition).data;

const app = express();
app.use(express.json());

// gRPC client setup
const client = new dataProto.DataService("localhost:50051", grpc.credentials.createInsecure());

app.post("/send-data", (req, res) => {
    const { message, number } = req.body;

    // Send data to the gRPC server
    client.sendData({ message, number }, (err, response) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ error: "Failed to send data to gRPC server" });
        }
        res.json({ confirmation: response.confirmation });
    });
});

app.listen(3000, () => {
    console.log("HTTP Server running on port 3000");
});

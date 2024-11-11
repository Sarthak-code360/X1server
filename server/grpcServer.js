// server/grpcServer.js
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "proto", "data.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const dataProto = grpc.loadPackageDefinition(packageDefinition).data;
// accesses the data package defined in data.proto

function sendData(call, callback) {
    console.log("Received data:", call.request);

    //Respond to the client
    callback(null, { confirmation: "Data received successfully" });
}

function main() {
    const server = new grpc.Server();

    server.addService(dataProto.DataService.service, { sendData });
    // refers to the service definition we loaded from data.proto

    server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
        console.log("gRPC Server running on port 50051");
        server.start();
    });
}

main();

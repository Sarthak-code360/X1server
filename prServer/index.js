const protobuf = require('protobufjs');
const fs = require('fs');
const net = require('net');

const TCP_PORT = 3050;

protobuf.load("ServerProperties.proto", function (err, root) {
    if (err) throw err;

    // Get the message type from proto file
    const PropertySend = root.lookupType("PropertySend");
    const PropertyReceive = root.lookupType("PropertyReceive");

    // Start TCP server
    const tcpserver = net.createServer(socket => {
        console.log('Hardware connected!');
    });

    tcpserver.listen(TCP_PORT, () => {
        console.log(`Server listening on port ${TCP_PORT}`);
    });
});
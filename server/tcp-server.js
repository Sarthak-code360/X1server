const net = require('net');

const PORT = 3000;

const server = net.createServer((socket) => {
    console.log('Client connected!', socket.remoteAddress);

    socket.on('data', (data) => {
        // Simply log the raw data received
        console.log('Raw Data received:', data);
    });

    socket.on('end', () => {
        console.log('Client disconnected!');
    });

    socket.on('error', (error) => {
        console.error('Error:', error.message);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

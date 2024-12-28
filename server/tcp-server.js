const net = require('net');

const PORT = 3000;

const server = net.createServer((socket) => {

    console.log('Client connected!', socket.remoteAddress);

    socket.on('data', (data) => {

        // Receive
        console.log('Raw Data received:', data);

        const message = data.toString('utf-8');
        console.log('Message:', message);

        const time = new Date().toISOString();
        console.log('Time:', time);

        // Respond
        socket.write(`Data received on server: ${message} at ${time}`);
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

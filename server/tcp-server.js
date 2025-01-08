const net = require('net');

const PORT = 3000;

const server = net.createServer((socket) => {

    console.log('Client connected!', socket.remoteAddress);

    socket.on('data', (data) => {

        // Receive
        console.log('\nRaw Data received:', data);

        const message = data.toString('hex');
        const time = new Date().toISOString();

        console.log('Message:', message, '\tTime:', time, '\n');

        // Respond
        socket.write(`Data received on server: ${message} at ${time}\n\n`);
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

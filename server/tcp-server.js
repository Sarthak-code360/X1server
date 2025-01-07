const net = require('net');

const PORT = 3000;

const server = net.createServer((socket) => {
    console.log('Client connected!', socket.remoteAddress);

    socket.on('data', (data) => {
        // Log the raw data (as Buffer)
        console.log('Raw Data received:', data);

        // Convert raw data to readable string format
        const readableData = data.toString('utf-8');
        console.log('Readable Data:', readableData);

        // Log timestamp
        const timestamp = new Date().toISOString();
        console.log('Timestamp:', timestamp);

        // Respond to the hardware
        socket.write('Data received at server!');
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

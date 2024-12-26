const net = require('net');

const PORT = 3000;

const server = net.createServer((socket) => {
    console.log('Client connected!', socket.remoteAddress);

    let buffer = '';

    socket.on('data', (data) => {
        buffer += data.toString('hex');

        // Check for a delimiter (e.g., newline '\n') to identify message boundaries
        let delimiter = '\n';
        let messages = buffer.split(delimiter);

        // Process all complete messages, leave incomplete in the buffer
        for (let i = 0; i < messages.length - 1; i++) {
            const rawMessage = messages[i];
            console.log('Raw HEX Data received:', rawMessage);

            const jsonData = { rawData: rawMessage, timestamp: new Date().toISOString() };
            console.log('Converted to JSON:', jsonData);

            socket.write('Data received!');
        }

        // Retain the last incomplete part in the buffer
        buffer = messages[messages.length - 1];
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

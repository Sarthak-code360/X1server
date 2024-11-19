const express = require('express');
const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

// Route to handle incoming requests
app.post('/upload', (req, res) => {
    console.log('Request received:', req.body);
    res.send('Data received successfully!');
});

// Start the server
const PORT = 80; // Use 443 for HTTPS
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

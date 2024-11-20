// server/httpServer.js
const express = require("express");

const app = express();
app.use(express.json()); // Parse JSON payloads

// POST route to receive data
app.post("/send-data", (req, res) => {
    const { message, number } = req.body; // Extract data from the request body

    // Log the received data
    console.log("Data received:", { message, number });

    // Send a confirmation response
    res.status(200).json({
        status: "success",
        receivedData: { message, number },
    });
});

// Start the server on port 80
app.listen(80, () => {
    console.log("HTTP server running on port 80");
});

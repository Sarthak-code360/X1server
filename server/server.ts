import express, { Request, Response } from "express";

const app = express();
app.use(express.json()); // Parse JSON payloads

// POST route to receive data
app.post("/send-data", (req: Request, res: Response) => {
    const { message, number } = req.body; // Extract data from the request body
    // Log the received data
    console.log("Data received:", { message, number });
    // Send a confirmation response
    res.status(200).json({
        status: "success",
        receivedData: { message, number },
    });
});

// GET route to send data to Arduino
app.get("/get-data", (req: Request, res: Response) => {
    // Define the data you want to send to Arduino
    const dataToSend = {
        message: "Hello Arduino this is Server",
        number: 42
    };

    // Send the data as a response
    res.status(200).json(dataToSend);
});

// Start the server on port 3000
app.listen(3000, "0.0.0.0", (err?: Error) => {
    if (err) {
        console.error("Error starting the server:", err);
    } else {
        console.log("HTTP server running on port 3000 (bound to all interfaces)");
    }
});

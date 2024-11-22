import express, { Request, Response } from "express";

// Import authentication logic from auth.js (using `require` because it's in JS)
const { verifySignature, hashSerialNumber } = require("./auth");

const crypto = require("crypto");

const app = express();
app.use(express.json());

// POST route for authentication
app.post("/auth", (req: Request, res: Response) => {
    console.log("Received POST request on /auth");

    // Step 1: Print serial number and its hash
    const serialNumber = "12345";
    const messageHash = hashSerialNumber();
    console.log("Serial Number:", serialNumber);
    console.log("Hash of Serial Number:", messageHash);

    // Step 2: Print message requesting signature
    console.log("Requesting signature from Arduino...");

    // Step 3: Extract signature from the request body
    const { signature } = req.body;
    console.log("Signature received:", signature);

    // Step 4: Verify the signature using the hash of the serial number
    const isValid = verifySignature(messageHash, signature);
    console.log("Is Signature Valid?", isValid);

    if (isValid) {
        // Step 5: Generate a random challenge (32 bytes)
        const challenge = crypto.randomBytes(32);
        console.log("Generated Random Challenge:", challenge.toString("hex"));

        // Step 6: XOR challenge with firmware number
        const firmwareNumber = 678910;
        const xorMessage = Buffer.concat([challenge, Buffer.from(firmwareNumber.toString())]);
        console.log("XORed Message (Challenge + Firmware Number):", xorMessage.toString("hex"));

        // Step 7: Hash the XORed message
        const xorMessageHash = crypto.createHash("sha256").update(xorMessage).digest("hex");
        console.log("Hash of XORed Message:", xorMessageHash);

        // Step 8: Request signature for the XORed message
        console.log("Requesting signature for XORed message...");

        // In real-world case, send XORed message to Arduino and wait for the signature
        // (For simulation, we're assuming Arduino's signature is included in the request)

        // Step 9: Extract the signature received for the XORed message
        const { xorSignature } = req.body;  // Assuming Arduino provides this signature
        console.log("Signature for XORed Message received:", xorSignature);

        // Step 10: Verify the signature for the XORed message
        const isXorSignatureValid = verifySignature(xorMessageHash, xorSignature);
        console.log("Is XOR Signature Valid?", isXorSignatureValid);

        // Step 11: Final Authentication result
        if (isXorSignatureValid) {
            console.log("Authenticated!!");
            res.status(200).json({ status: "success", message: "Authentication successful!" });
        } else {
            console.log("XOR Signature verification failed.");
            res.status(400).json({ status: "failure", message: "Invalid XOR signature!" });
        }
    } else {
        console.log("Initial signature verification failed.");
        res.status(400).json({ status: "failure", message: "Invalid signature!" });
    }
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");

    // Print serial number and hash when the server starts
    const serialNumber = "12345";
    const messageHash = hashSerialNumber();
    console.log("Serial Number:", serialNumber);
    console.log("Hash of Serial Number:", messageHash);
});

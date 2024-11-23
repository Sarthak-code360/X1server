const express = require('express');
const bodyParser = require('body-parser');
const elliptic = require('elliptic');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Constants
const serialNumber = [
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
    0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20
];
const publicKeyArray = [
    0x59, 0x84, 0xD4, 0x49, 0x3E, 0x99, 0x4D, 0xB9, 0xA5, 0xFF, 0x49, 0x9E, 0xCD, 0x2C, 0x04, 0xD9, 0xED, 0x63, 0xB5, 0xC0, 0x15, 0x5F, 0x87, 0x0C, 0xE2, 0x03, 0xF5, 0xC5, 0x63, 0x05, 0x41, 0xAD, 0x75, 0x29, 0x1A, 0xB5, 0xD7, 0x09, 0x45, 0x8C, 0x4B, 0xB2, 0x5F, 0xAE, 0x38, 0x35, 0x8A, 0x3A, 0x14, 0x2A, 0xE7, 0x43, 0x4F, 0x08, 0x99, 0xF3, 0x5A, 0x05, 0x28, 0x78, 0x54, 0x9A, 0xAE, 0xAC
];
const publicKeyHex = Buffer.from([0x04, ...publicKeyArray]).toString('hex'); // Uncompressed public key

// Initialize elliptic curve
const ec = new elliptic.ec('p256');

// Utility function to convert byte array to hex string
const byteToString = (bytes) => Buffer.from(bytes).toString('hex');

// Utility function to hash data (SHA-256)
const hashData = (data) => {
    const hash = crypto.createHash('sha256');
    hash.update(Buffer.from(data));
    return hash.digest('hex');
};

// Function to verify the signature
const verifySignature = (signature) => {
    const message1 = hashData(serialNumber);
    const key = ec.keyFromPublic(publicKeyHex, 'hex');

    try {
        // Decode the signature into r and s components
        const signatureBuffer = Buffer.from(signature, 'hex');
        const r = signatureBuffer.slice(0, 32).toString('hex');
        const s = signatureBuffer.slice(32).toString('hex');

        const verified = key.verify(message1, { r, s });

        if (verified) {
            console.log('Successfully verified!');
            return true;
        } else {
            console.error('Verification failed.');
            return false;
        }
    } catch (error) {
        console.error('Error during verification:', error);
        return false;
    }
};

// Routes
app.post('/verify', (req, res) => {
    const { signature } = req.body;

    if (!signature) {
        console.error('No signature received.');
        return res.status(400).json({ error: 'Signature is required.' });
    }

    console.log('Signature1 received:', signature);

    // Step 1: Verify the signature
    const isVerified = verifySignature(signature);

    if (isVerified) {
        return res.json({ message: 'Successfully verified!' });
    } else {
        return res.status(401).json({ error: 'Verification failed.' });
    }
});

// Start the server and print Serial Number and its hash
app.listen(port, () => {
    console.log(`Auth server running on http://localhost:${port}`);

    // Print the serial number and its hash immediately when the server starts
    console.log('Serial Number:', byteToString(serialNumber));

    const message1 = hashData(serialNumber);
    console.log('Hash of Serial Number (Message1):', message1);
    console.log('Waiting for signature...');
});

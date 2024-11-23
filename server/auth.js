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
    0xD4, 0x74, 0xD7, 0x0C, 0xB6, 0x00, 0xE7, 0x1F,
    0x15, 0x60, 0xAC, 0x97, 0x31, 0x50, 0x2D, 0xAD,
    0x6D, 0x26, 0xC7, 0x9A, 0xB7, 0x78, 0x2A, 0x5B,
    0x50, 0x1E, 0xAB, 0x0D, 0x39, 0x37, 0xBC, 0x10
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

// Routes
app.get('/', (req, res) => {
    console.log('Serial Number:', byteToString(serialNumber));

    const message1 = hashData(serialNumber);
    console.log('Message1 (Hash of Serial Number):', message1);

    console.log('Waiting for signature...');
    res.json({ message: 'Server is ready. Waiting for signature.' });
});

app.post('/verify', (req, res) => {
    const { signature } = req.body;

    if (!signature) {
        console.error('No signature received.');
        return res.status(400).json({ error: 'Signature is required.' });
    }

    console.log('Signature1 received:', signature);

    // Step 1: Verify the signature
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
            return res.json({ message: 'Successfully verified!' });
        } else {
            console.error('Verification failed.');
            return res.status(401).json({ error: 'Verification failed.' });
        }
    } catch (error) {
        console.error('Error during verification:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port 3000`);
});

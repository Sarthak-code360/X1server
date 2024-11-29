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
const firmwareNumber = [
    0xDE, 0xAD, 0xBE, 0xEF, 0x01, 0x23, 0x45, 0x67,
    0x89, 0xAB, 0xCD, 0xEF, 0x10, 0x32, 0x54, 0x76,
    0x98, 0xBA, 0xDC, 0xFE, 0x11, 0x22, 0x33, 0x44,
    0x55, 0x66, 0x77, 0x88, 0x99, 0xAA, 0xBB, 0xCC,
    0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
    0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF,
    0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF,
    0x10, 0x32, 0x54, 0x76, 0x98, 0xBA, 0xDC, 0xFE
];
const publicKeyArray = [
    0x59, 0x84, 0xD4, 0x49, 0x3E, 0x99, 0x4D, 0xB9, 0xA5, 0xFF, 0x49, 0x9E, 0xCD, 0x2C, 0x04, 0xD9, 0xED, 0x63, 0xB5, 0xC0, 0x15, 0x5F, 0x87, 0x0C, 0xE2, 0x03, 0xF5, 0xC5, 0x63, 0x05, 0x41, 0xAD, 0x75, 0x29, 0x1A, 0xB5, 0xD7, 0x09, 0x45, 0x8C, 0x4B, 0xB2, 0x5F, 0xAE, 0x38, 0x35, 0x8A, 0x3A, 0x14, 0x2A, 0xE7, 0x43, 0x4F, 0x08, 0x99, 0xF3, 0x5A, 0x05, 0x28, 0x78, 0x54, 0x9A, 0xAE, 0xAC
];
const publicKeyHex = Buffer.from([0x04, ...publicKeyArray]).toString('hex'); // Uncompressed public key

// Initialize elliptic curve
const ec = new elliptic.ec('p256');

// Variables for tracking progress
let randomChallenge = null;
let message2 = null;
let immobilizeData = "1";
let rpm_preset = "0";

// Utility function to convert byte array to hex string
const byteToString = (bytes) => Buffer.from(bytes).toString('hex');

// Utility function to hash data (SHA-256)
const hashData = (data) => {
    const hash = crypto.createHash('sha256');
    hash.update(Buffer.from(data));
    return hash.digest('hex');
};

const generateRandomChallenge = () => crypto.randomBytes(32);
const xorArrays = (arr1, arr2) => arr1.map((byte, index) => byte ^ arr2[index]);

// Function to verify the signature
const verifySignature = (message, signature) => {
    const key = ec.keyFromPublic(publicKeyHex, 'hex');

    try {
        const signatureBuffer = Buffer.from(signature, 'hex');
        const r = signatureBuffer.slice(0, 32).toString('hex');
        const s = signatureBuffer.slice(32).toString('hex');
        return key.verify(message, { r, s });
    } catch (error) {
        console.error('Error during verification:', error);
        return false;
    }
};

// Routes
app.get('/immobilize-data', (req, res) => {
    console.log('Immobilize Data sent to hardware:', immobilizeData);
    res.json({ immobilizeData });
});

app.get('/rpm-data', (req, res) => {
    console.log('Received a GET request for RPM Preset Data');
    console.log('Current rpm_preset value:', rpm_preset);
    res.json({ rpm_preset });
});

app.post('/device-data', (req, res) => {
    const {
        gpsCoordinates,
        signature,
        rpm,
        current,
        voltage,
        temperature,
    } = req.body; // Use req.body to handle POST data

    // Validate that all required fields are provided
    if (!gpsCoordinates || !signature || !rpm || !current || !voltage || !temperature) {
        return res.status(400).json({
            error: 'Missing one or more required fields: gpsCoordinates, signature, rpm, current, voltage, temperature',
        });
    }

    // Log the received data
    console.log('Device Data Received:');
    console.log('GPS Coordinates:', gpsCoordinates);
    console.log('Signature:', signature);
    console.log('RPM:', rpm);
    console.log('Current:', current);
    console.log('Voltage:', voltage);
    console.log('Temperature:', temperature);

    // Respond to the device with a success message
    res.json({
        message: 'Device data received successfully!',
        data: {
            gpsCoordinates,
            signature,
            rpm,
            current,
            voltage,
            temperature,
        },
    });
});


app.post('/verify', (req, res) => {
    const { signature } = req.body;

    console.log('Raw request body:', req.body);
    console.log('Signature received:', signature);

    if (!signature) {
        return res.status(400).json({ error: 'Signature is required.' });
    }

    const message1 = hashData(serialNumber);
    console.log('Message1:', message1);

    const isVerified = verifySignature(message1, signature);

    if (isVerified) {
        console.log('Successfully verified Signature1 !');

        // Generate and store Random Challenge
        randomChallenge = generateRandomChallenge();
        console.log('Random Challenge:', byteToString(randomChallenge));

        return res.json({
            message: 'Signature1 Verified!! Random challenge generated. Use GET /random-challenge to fetch it.'
        });
    } else {
        console.log('Signature verification failed.');
        return res.status(401).json({ error: 'Signature verification failed.' });
    }
});

app.get('/random-challenge', (req, res) => {
    if (!randomChallenge) {
        return res.status(400).json({ error: 'Random challenge not generated yet.' });
    }

    console.log('Random Challenge sent to client.');
    res.json({ randomChallenge: byteToString(randomChallenge) });
});

app.post('/signature2', (req, res) => {
    const { signature2 } = req.body;

    if (!randomChallenge) {
        return res.status(400).json({ error: 'Random challenge not generated yet.' });
    }

    if (!signature2) {
        return res.status(400).json({ error: 'Signature2 is required.' });
    }

    console.log('Signature2 received:', signature2);

    // XOR Random Challenge with Firmware Number
    const xorResult = xorArrays(randomChallenge, firmwareNumber);
    console.log('XOR of Random Challenge and Firmware Number:', byteToString(xorResult));

    // Hash XOR result to create Message2
    message2 = hashData(xorResult);
    console.log('Message2 (Hash of XOR):', message2);

    // Verify Signature2 with Message2
    const isVerified = verifySignature(message2, signature2);

    if (isVerified) {
        console.log('Authenticated!');
        res.json({ message: 'Authentication successful!' });
    } else {
        console.error('Message2 verification failed.');
        res.status(401).json({ error: 'Authentication failed.' });
    }
});

// Start the server and print Serial Number and its hash
app.listen(port, () => {
    console.log(`Server running on 3000 port.`);

    // Print the serial number and its hash immediately when the server starts
    console.log('Serial Number:', byteToString(serialNumber));

    const message1 = hashData(serialNumber);
    console.log('Hash of Serial Number (Message1):', message1);
    console.log('Waiting for signature...');
});

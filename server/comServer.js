const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware for JSON
app.use(bodyParser.json());
app.use(bodyParser.text()); // For handling plain text requests

// IMMOBILIZATION DATA
let immobilizeData = null;
let rpmPreset = null;
let latestHardwareData = null; // To store the latest hardware data

// Utility function: Convert JSON to Plain Text
const jsonToPlainText = (json) => {
    return Object.entries(json).map(([key, value]) => `${key}:${value}`).join(',');
};

// Utility function: Convert Plain Text to JSON
const plainTextToJson = (text) => {
    return text.split(',').reduce((acc, item) => {
        const [key, value] = item.split(':');
        acc[key] = value;
        return acc;
    }, {});
};

// Mobile App Endpoints (JSON)
app.post('/app-immobilize-data', (req, res) => {
    const { immobilizeDataMob } = req.body;
    if (!immobilizeDataMob) {
        return res.status(400).json({ error: 'Immobilize data is required.' });
    }

    console.log('Received Immobilize Data from App:', immobilizeDataMob);
    immobilizeData = immobilizeDataMob;

    // Forward to Hardware in Plain Text
    const dataToHardware = `IMMOBILIZE:${immobilizeData}`;
    console.log('Sending to Hardware:', dataToHardware);

    res.json({ message: 'Immobilize data forwarded to hardware.' });
});

app.post('/app-rpm-preset', (req, res) => {
    const { rpmPresetMob } = req.body;
    if (!rpmPresetMob) {
        return res.status(400).json({ error: 'RPM preset is required.' });
    }

    console.log('Received RPM Preset from App:', rpmPresetMob);
    rpmPreset = rpmPresetMob;

    // Forward to Hardware in Plain Text
    const dataToHardware = `RPM:${rpmPreset}`;
    console.log('Sending to Hardware:', dataToHardware);

    res.json({ message: 'RPM preset forwarded to hardware.' });
});
app.get('/app-device-data', (req, res) => {
    if (!latestHardwareData) {
        console.log('Data not received from hardware yet.');
        return res.status(404).send('Data not received from hardware yet.');
    }

    console.log('Sending Device Data to App:', latestHardwareData);
    res.json(latestHardwareData);
});

// Hardware Endpoints (Plain Text)
app.get('/immobilize-data', (req, res) => {
    console.log('Sending Immobilize Data to Hardware:', immobilizeData);
    res.send(`IMMOBILIZE:${immobilizeData}`);
});

app.get('/rpm-preset', (req, res) => {
    console.log('Sending RPM Preset to Hardware:', rpmPreset);
    res.send(`RPM:${rpmPreset}`);
});

app.post('/device-data', (req, res) => {
    const rawData = req.body; // Expecting plain text

    if (typeof rawData !== 'string' || rawData.trim() === '') {
        console.error('Invalid or empty data received from Hardware.');
        return res.status(400).send('Invalid data format. Expected plain text.');
    }

    console.log('Raw Data from Hardware:', rawData);

    // Parse Plain Text to JSON for App
    const parsedData = plainTextToJson(rawData);
    console.log('Parsed Hardware Data:', parsedData);

    // Store the latest data in memory
    latestHardwareData = parsedData;

    res.send('Data received and processed.');
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

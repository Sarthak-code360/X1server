const crypto = require("crypto");

// Public Key
const publicKey = [
    0xD4, 0x74, 0xD7, 0x0C, 0xB6, 0x00, 0xE7, 0x1F,
    0x15, 0x60, 0xAC, 0x97, 0x31, 0x50, 0x2D, 0xAD,
    0x6D, 0x26, 0xC7, 0x9A, 0xB7, 0x78, 0x2A, 0x5B,
    0x50, 0x1E, 0xAB, 0x0D, 0x39, 0x37, 0xBC, 0x10
];

// Serial Number
const serialNumber = [
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
    0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20
];


const firmwareNumber = "678910"; // Firmware number

// Function to hash the serial number
function hashSerialNumber() {
    const hash = crypto.createHash("sha256");
    hash.update(serialNumber);
    return hash.digest("hex");
}

// Function to verify the signature (simplified for demonstration)
function verifySignature(messageHash, signature) {
    // Normally, this would involve public key cryptography, but we're simplifying here
    // In a real scenario, we'd use the public key to verify the signature against the message hash
    // For simplicity, assuming the signature is valid
    return signature === messageHash; // Placeholder logic for validation
}

// Function to generate a random challenge
function generateRandomChallenge() {
    return Math.floor(Math.random() * 1000000); // Random challenge between 0 and 1 million
}

// Function to XOR the random challenge with the firmware number and hash it
function createXORMessage() {
    const challenge = generateRandomChallenge();
    console.log("Random Challenge:", challenge);

    // XOR the random challenge with the firmware number
    const xorMessage = challenge ^ parseInt(firmwareNumber);
    console.log("XOR of Challenge and Firmware Number:", xorMessage);

    // Hash the XORed message
    const hash = crypto.createHash("sha256");
    hash.update(xorMessage.toString());
    const hashedMessage = hash.digest("hex");

    console.log("Hashed XORed Message:", hashedMessage);
    return hashedMessage; // Return the hashed message
}

module.exports = {
    verifySignature,
    hashSerialNumber,
    createXORMessage
};

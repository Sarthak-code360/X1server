const crypto = require("crypto");

// Hardcoded Public Key (for signature verification)
const publicKey = "B4225590B9A2D06A52AA34E9449C1EC7A216A38D9AE877DF8FEC631C65ACC7705711E5422F5DE907D63FED3CB78C283A1C5B1191391E32FBB4FD42665EF94D8C"; // Example public key

// Hardcoded Serial Number and Firmware Number
const serialNumber = "12345";
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

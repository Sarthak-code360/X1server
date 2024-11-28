#include <SoftwareSerial.h>
#include <Crypto.h>
#include <uECC.h>

// Create software serial object to communicate with SIM7600X
SoftwareSerial sim7600x(2, 3); // RX, TX

uint8_t signature[64];
int SigSize;
String dataHexString = "";
String jsonPayload = "";

uint8_t PRIVATE_KEY[64] = {
    0xFE, 0xAF, 0xAB, 0xC1, 0x1F, 0xFE, 0x66, 0x5A, 
    0xB6, 0x3E, 0xC0, 0x30, 0x00, 0xD9, 0x7B, 0x6B, 
    0xEB, 0x71, 0xC7, 0x8D, 0x01, 0xCA, 0xAD, 0x68, 
    0x6F, 0xE3, 0x17, 0x95, 0xFE, 0x7F, 0x76, 0x7F, 
    0x3A, 0x33, 0x30, 0x30, 0x30, 0x2F, 0x73, 0x65, 
    0x6E, 0x64, 0x2D, 0x64, 0x61, 0x74, 0x61, 0x22, 
    0x00, 0x41, 0x54, 0x2B, 0x48, 0x54, 0x54, 0x50, 
    0x50, 0x41, 0x52, 0x41, 0x3D, 0x22, 0x43, 0x4F
};

uint8_t PUBLIC_KEY[64] = {
    0x59, 0x84, 0xD4, 0x49, 0x3E, 0x99, 0x4D, 0xB9, 
    0xA5, 0xFF, 0x49, 0x9E, 0xCD, 0x2C, 0x04, 0xD9, 
    0xED, 0x63, 0xB5, 0xC0, 0x15, 0x5F, 0x87, 0x0C, 
    0xE2, 0x03, 0xF5, 0xC5, 0x63, 0x05, 0x41, 0xAD, 
    0x75, 0x29, 0x1A, 0xB5, 0xD7, 0x09, 0x45, 0x8C, 
    0x4B, 0xB2, 0x5F, 0xAE, 0x38, 0x35, 0x8A, 0x3A, 
    0x14, 0x2A, 0xE7, 0x43, 0x4F, 0x08, 0x99, 0xF3, 
    0x5A, 0x05, 0x28, 0x78, 0x54, 0x9A, 0xAE, 0xAC
};

uint8_t FIRMWARE_NUM[64] = {
    0xDE, 0xAD, 0xBE, 0xEF, 0x01, 0x23, 0x45, 0x67, 
    0x89, 0xAB, 0xCD, 0xEF, 0x10, 0x32, 0x54, 0x76, 
    0x98, 0xBA, 0xDC, 0xFE, 0x11, 0x22, 0x33, 0x44, 
    0x55, 0x66, 0x77, 0x88, 0x99, 0xAA, 0xBB, 0xCC, 
    0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 
    0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF, 
    0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF, 
    0x10, 0x32, 0x54, 0x76, 0x98, 0xBA, 0xDC, 0xFE
};


void sendATCommand(String command, int timeout)
{
  Serial.println("Sending: " + command);
  sim7600x.println(command);
  delay(timeout); 

  while (sim7600x.available())
  {
    String response = sim7600x.readString();
    Serial.println(response);
  }
}

static int RNG(uint8_t *dest, unsigned size) {
  // Use the least-significant bits from the ADC for an unconnected pin (or connected to a source of 
  // random noise). This can take a long time to generate random data if the result of analogRead(0) 
  // doesn't change very frequently.
  while (size) {
    uint8_t val = 0;
    for (unsigned i = 0; i < 8; ++i) {
      int init = analogRead(0);
      int count = 0;
      while (analogRead(0) == init) {
        ++count;
      }
      
      if (count == 0) {
         val = (val << 1) | (init & 0x01);
      } else {
         val = (val << 1) | (count & 0x01);
      }
    }
    *dest = val;
    ++dest;
    --size;
  }
  // NOTE: it would be a good idea to hash the resulting random data using SHA-256 or similar.
  return 1;
}

void setup()
{
  // Start Serial Monitor
  Serial.begin(9600);
  // Start SIM7600X communication
  sim7600x.begin(115200);

  const struct uECC_Curve_t *curve = uECC_secp256r1();
  uint8_t private_key_[64];
  uint8_t public_key_[64];
  int ret;
  uECC_set_rng(&RNG);

  SHA256 hasher;

  Serial.println("Initializing SHA-256 Algo...");

  // Define a serial number as a 32-byte array
  byte serialNumber[32] = {
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
    0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20
  };

  // Hash the serial number
  hasher.doUpdate(serialNumber, sizeof(serialNumber));

  /* Compute the final hash */
  byte hash[SHA256_SIZE];
  hasher.doFinal(hash);

  /* Print the resulting hash */
  Serial.println("Computed SHA-256 Hash:");
  for (byte i = 0; i < 64; i++) {
    Serial.print("0x");
    if (hash[i] < 0x10) {
      Serial.print('0'); // Add leading zero for single hex digits
    }
    Serial.print(hash[i], HEX);
    Serial.print(", ");
  }
  Serial.println();


  Serial.println("Initializing Micro ECC Algo...");

  Serial.println("Signature: ");
  // ECC Signature Generation
  uECC_sign(    PRIVATE_KEY,
                hash,
                SHA256_SIZE,
                signature,
                curve);

  // Converts the signature to a hexadecimal string
  for (byte i = 0; i < 64; i++)
  {
    if (signature[i] < 0x10)
    {
      Serial.print('0');
    }
    Serial.print(signature[i], HEX);
  }

  Serial.println("");

  SigSize = sizeof(signature) / sizeof(signature[0]);

  for (int i = 0; i < SigSize; i++)
  {
    if (signature[i] < 0x10)
      dataHexString += "0"; // Add leading zero for single hex digits
    dataHexString += String(signature[i], HEX);
  }
  Serial.println(dataHexString);
  Serial.println("");

  jsonPayload = "{\"message\": \"" + dataHexString + "\",\"number\":123}";

  Serial.println("Initializing HTTP...");

  delay(1000);

  // Initialize module
  sendATCommand("AT", 1000);
  sendATCommand("AT+CPIN?", 1000);

  // Wait for network registration
  sendATCommand("AT+CREG?", 1000);
  delay(2000);

  // Configure bearer profile
  sendATCommand("AT+SAPBR=3,1,\"Contype\",\"GPRS\"", 1000);
  sendATCommand("AT+SAPBR=3,1,\"APN\",\"airtelgprs.com\"", 1000); // Use your carrier's APN
  sendATCommand("AT+SAPBR=1,1", 2000);
}


void loop()
{
  // Initialize HTTP service
  sendATCommand("AT+HTTPINIT", 1000);
  sendATCommand("AT+HTTPPARA=\"CID\",1", 1000);

  // Set the URL
  sendATCommand("AT+HTTPPARA=\"URL\",\"http://3.111.42.71:3000/verify\"", 1000);

  // Set content type to JSON for  HTTP
  sendATCommand("AT+HTTPPARA=\"CONTENT\",\"application/json\"", 1000);

  // Prepare JSON before sending
  sendATCommand("AT+HTTPDATA=" + String(jsonPayload.length()) + ",10000", 1000);

  sim7600x.println(jsonPayload);

  // Prepare the data to send
  //sendATCommand("AT+HTTPDATA=" + String(SigSize) + ",10000", 1000);

  // Send the data
  //sim7600x.println(dataHexString);
  delay(1000);

  // Perform POST request -> Send data
  sendATCommand("AT+HTTPACTION=1", 5000);

  // Read the response -> Recive response
  sendATCommand("AT+HTTPREAD", 1000);

  // Terminate HTTP service
  sendATCommand("AT+HTTPTERM", 1000);
}
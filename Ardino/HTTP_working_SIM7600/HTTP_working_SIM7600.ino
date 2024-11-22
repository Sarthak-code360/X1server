#include <SoftwareSerial.h>
#include <Crypto.h>
#include <uECC.h>

// Create software serial object to communicate with SIM7600X
SoftwareSerial sim7600x(2, 3); // RX, TX

uint8_t signature[32];
int SigSize;
String dataHexString = "";
String jsonPayload = "";

uint8_t PRIVATE_KEY[32] = {
  0xEF, 0xFF, 0x6F, 0xD5, 0xD8, 0xBA, 0x6B, 0x7A,
  0xFD, 0xFF, 0x6D, 0xC7, 0xD6, 0x56, 0xC7, 0x7B,
  0x01, 0xFC, 0xAE, 0xDE, 0x5A, 0x5B, 0xD6, 0xFE, 
  0x3F, 0xFC, 0x6A, 0xA8, 0x7A, 0x5F, 0xBD, 0x80
};

uint8_t PUBLIC_KEY[32] = {
  0xD4, 0x74, 0xD7, 0x0C, 0xB6, 0x00, 0xE7, 0x1F,
  0x15, 0x60, 0xAC, 0x97, 0x31, 0x50, 0x2D, 0xAD,
  0x6D, 0x26, 0xC7, 0x9A, 0xB7, 0x78, 0x2A, 0x5B,
  0x50, 0x1E, 0xAB, 0x0D, 0x39, 0x37, 0xBC, 0x10
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
  uint8_t private_key[21];
  uint8_t public_key[40];
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
  for (byte i = 0; i < SHA256_SIZE; i++) {
    Serial.print("0x");
    if (hash[i] < 0x10) {
      Serial.print('0'); // Add leading zero for single hex digits
    }
    Serial.print(hash[i], HEX);
    Serial.print(", ");
  }
  Serial.println();


  Serial.println("Initializing Micro ECC Algo...");

  // ESS Key Generation and printing
  // Serial.println("Private Key: ");
  // uECC_make_key(public_key, private_key, curve);
  // // print Private Key
  // for (byte i = 0; i < SHA256_SIZE; i++)
  // {
  //   Serial.print("0x");
  //   if (private_key[i] < 0x10)
  //   {
  //     Serial.print('0');
  //   }
  //   Serial.print(private_key[i], HEX);
  //   Serial.print(", ");
  // }

  // Serial.println("");

  // Serial.println("Public Key: ");
  // // print Public key
  // for (byte i = 0; i < SHA256_SIZE; i++)
  // {
  //   Serial.print("0x");
  //   if (public_key[i] < 0x10)
  //   {
  //     Serial.print('0');
  //   }
  //   Serial.print(public_key[i], HEX);
  //   Serial.print(", ");
  // }
  // Serial.println("");

  Serial.println("Signature: ");
  // ECC Signature Generation
  uECC_sign(    PRIVATE_KEY,
                hash,
                SHA256_SIZE,
                signature,
                curve);

  // Converts the signature to a hexadecimal string
  for (byte i = 0; i < SHA256_SIZE; i++)
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
  sendATCommand("AT+HTTPPARA=\"URL\",\"http://13.232.182.84:3000/send-data\"", 1000);

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


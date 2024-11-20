#include <SoftwareSerial.h>
#include <Crypto.h>
#include <uECC.h>

// Create software serial object to communicate with SIM7600X
SoftwareSerial sim7600x(2, 3); // RX, TX

uint8_t signature[64];
int SigSize;
String dataHexString = "";
String jsonPayload = "";

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

  const char *hello = "Hello World";
  hasher.doUpdate(hello, strlen(hello));

  /* Update the hash with just a plain string*/
  hasher.doUpdate("Goodbye World");

  /* Update the hash with a binary message */
  byte message[10] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
  hasher.doUpdate(message, sizeof(message));

  /* Compute the final hash */
  byte hash[SHA256_SIZE];
  hasher.doFinal(hash);

  /* hash now contains our 32 byte hash */
  for (byte i = 0; i < SHA256_SIZE; i++)
  {
    if (hash[i] < 0x10)
    {
      Serial.print('0');
    }
    Serial.print(hash[i], HEX);
  }

  Serial.println("");

  Serial.println("Initializing Micro ECC Algo...");

  uECC_make_key(public_key, private_key, curve);

  for (byte i = 0; i < SHA256_SIZE; i++)
  {
    if (private_key[i] < 0x10)
    {
      Serial.print('0');
    }
    Serial.print(private_key[i], HEX);
  }

  Serial.println("");

  for (byte i = 0; i < SHA256_SIZE; i++)
  {
    if (public_key[i] < 0x10)
    {
      Serial.print('0');
    }
    Serial.print(public_key[i], HEX);
  }

  Serial.println("");

  uECC_sign(private_key,
                hash,
                SHA256_SIZE,
                signature,
                curve);

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
  Serial.println(SigSize);
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
  sendATCommand("AT+HTTPPARA=\"URL\",\"http://43.204.107.234:3000/send-data\"", 1000);

  // Set content type   JSON is APPEPTED by HTTP not PLAIN TEXT
  sendATCommand("AT+HTTPPARA=\"CONTENT\",\"application/json\"", 1000);

  // Prepare JSON before sending
  sendATCommand("AT+HTTPDATA=" + String(jsonPayload.length()) + ",10000", 1000);

  sim7600x.println(jsonPayload);

  // Prepare the data to send
  //sendATCommand("AT+HTTPDATA=" + String(SigSize) + ",10000", 1000);

  // Send the data
  //sim7600x.println(dataHexString);
  delay(1000);

  // Perform POST request
  sendATCommand("AT+HTTPACTION=1", 5000);

  // Read the response
  sendATCommand("AT+HTTPREAD", 1000);

  // Terminate HTTP service
  sendATCommand("AT+HTTPTERM", 1000);
}


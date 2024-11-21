#include <SoftwareSerial.h>
#include <Crypto.h>
#include <uECC.h>

// Create software serial object to communicate with SIM7600X
SoftwareSerial sim7600x(2, 3); // RX, TX

String dataHexString = "{\"message\":\"Hello from Arduino\",\"number\":123}"; // JSON payload

void sendATCommand(String command, int timeout)
{
  Serial.println("Sending: " + command);
  sim7600x.println(command);
  delay(timeout);

  while (sim7600x.available())
  {
    String response = sim7600x.readString();
    Serial.println(response); // Log responses for debugging
  }
}

void setup()
{
  // Start Serial Monitor
  Serial.begin(9600);

  // Start SIM7600X communication
  sim7600x.begin(115200);

  Serial.println("Initializing...");

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

  // Set the URL for your AWS EC2 instance
  sendATCommand("AT+HTTPPARA=\"URL\",\"http://13.232.182.84:3000/send-data\"", 1000);

  // Set content type as JSON
  sendATCommand("AT+HTTPPARA=\"CONTENT\",\"application/json\"", 1000);

  // Prepare the data to send
  sendATCommand("AT+HTTPDATA=" + String(dataHexString.length()) + ",10000", 1000);
  sim7600x.println(dataHexString);
  delay(1000);

  // Perform POST request
  sendATCommand("AT+HTTPACTION=1", 5000);

  // Read the response
  sendATCommand("AT+HTTPREAD", 1000);

  // Terminate HTTP service
  sendATCommand("AT+HTTPTERM", 1000);

  delay(10000); // Send data every 10 seconds
}

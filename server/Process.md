# SERVER

## Static variables (Hardcode) => Serial number, Firmware number (same of Server and Arduino)

```
Step 1 ==> Hash (Message { hard code a serial number in server }) ---> Read signature from HW ---> Verify Sign via Public key(InCode) & Hash of Message (Serial Number) 
Step 2==> Write a Random Challenge ---> Hash (Message { XOR of Random Challenge and Firmware Number}) ---> Read Signature received ---> Verify the Sign via Public Key and Hash generated from XOR.
```

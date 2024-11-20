# SERVER

## Static variables (Hardcode) => Serial number, Firmware number (same of Server and Arduino)

```
==> Message { Allot serial number in server and create its Hash } ---> Read signature from HW ---> Verify Sign via Public key(InCode) & Hash of Original Message (Serial Number)
==> Write a Random Challenge ---> Message { Hash(XOR Random Challenge with Firmware Number) } ---> Read Signature received ---> Verify the Sign via Public Key and Hash generated from XOR.
```

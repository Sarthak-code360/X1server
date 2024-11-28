# ARDUINO

Arduino present message sent format
```
Initializing SHA-256 Algo...

BDE17688F83F5744BCEDEC5A1D876C3C170C152E0B3911DE274B4D31275FF894

Initializing Micro ECC Algo...

(Public) - Make it static
9FAA7CEDEA94BCF8076CD6FDD19C0F17F0FFF75B37EDBF2C1EB0BE52BD4EFBCE

(Private) - Make it static
895FF47060C72BC6BF16D7B254FABD0B33084A16070919F0090D4D71F02E70A5

Signature generated:
E3B6B54B199147AA8DB35304B2201F92562EDD14ACDAD45138B18CDFEAED0FC4

Signature received on server: (match it with generated signature)
e3b6b54b199147aa8db35304b2201f92562edd14acdad45138b18cdfeaed0fc44f89b758713d382fa3d97bb0af9158073e62ad1972d8397195ad3cbf016e7faf
```

## Steps for Auth in Arduino: 

### Static variables (Hardcode) => Serial number, Firmware number (same of Server and Ardino)

```
==> Message { Allot serial number and create Hash } ---> Send signature to server ---> Wait for 1st step Verification (success or not) ?
==> Read a Random Challenge ---> Message { Hash(XOR Random Challenge with Firmware Number) } ---> Send Signature to Server ---> Wait for confirmation of Authenticated!
```


// ESS Key Generation and printing
  // Serial.println("Private Key: ");
  // uECC_make_key(public_key_, private_key_, curve);
  // // print Private Key
  // for (byte i = 0; i < 64; i++)
  // {
  //   Serial.print("0x");
  //   if (private_key_[i] < 0x10)
  //   {
  //     Serial.print('0');
  //   }
  //   Serial.print(private_key_[i], HEX);
  //   Serial.print(", ");
  // }

  // Serial.println("");

  // Serial.println("Public Key: ");
  // // print Public key
  // for (byte i = 0; i < 64; i++)
  // {
  //   Serial.print("0x");
  //   if (public_key_[i] < 0x10)
  //   {
  //     Serial.print('0');
  //   }
  //   Serial.print(public_key_[i], HEX);
  //   Serial.print(", ");
  // }
  // Serial.println("");


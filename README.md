# wallet-core-essentials
[![npm version](https://img.shields.io/npm/v/@kitzen/wallet-core-essentials?color=green)](https://www.npmjs.com/package/@kitzen/wallet-core-essentials)
[![from kitzen with Love](https://img.shields.io/badge/from%20kitzen%20with-%F0%9F%A4%8D-red)](https://kitzen.io/)
![test](https://github.com/kitzen-io/wallet-core-essentials/workflows/build-publish/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/kitzen-io/wallet-core-essentials/badge.svg)](https://snyk.io/test/github/kitzen-io/wallet-core-essentials)

Kitzen Wallet Core Essentials is an open-source library, provides reusable components and core cryptographic wallet functionality for a different blockchains. It is a core part of Kitzen Wallet.
# Installation

Modify package.json with 
```json
{  
  "scripts": {
    "postinstall": "patch-package"
  }
}
```
Execute the following commands
```bash
mkdir -p ./patches
cat > patches/cipher-base+1.0.4.patch <<- EOM
diff --git a/node_modules/cipher-base/index.js b/node_modules/cipher-base/index.js
index 6728005..fd5ada7 100644
--- a/node_modules/cipher-base/index.js
+++ b/node_modules/cipher-base/index.js
@@ -1,5 +1,5 @@
 var Buffer = require('safe-buffer').Buffer
-var Transform = require('stream').Transform
+var Transform = require('stream-browserify').Transform
 var StringDecoder = require('string_decoder').StringDecoder
 var inherits = require('inherits')

EOM
```
Install the package

```
yarn add @kitzen/wallet-core-essentials
```

### React-native installation

Create `initialize.ts` file and import it somewhere on the main entry, e.g. onm the react-native `index.js`
```typescript
import {Buffer} from "buffer";
import {CryptoFactory} from "@kitzen/wallet-core-essentials";
import * as bip39 from "@kitzen/react-native-bip39";

global.Buffer = Buffer;
CryptoFactory.setBip39(bip39);
```

### Web installation

Initialize factory, before using it:
```typescript
import {Buffer} from "buffer";
import {CryptoFactory} from "@kitzen/wallet-core-essentials";
import bip39 from "bip39";

global.Buffer = Buffer;
CryptoFactory.setBip39(bip39);
```


## Tron hex message decode

Without signature:
```bash
cd ./node_modules/@tronscan/client/protobuf
echo 'long-hex-message-string-like-a30174b6c2223' | xxd -r -p - > message.bin
protoc --decode protocol.Transaction.raw core/Tron.proto < message.bin
```

There are 2 types of messages: with signature and without signature.
You have to understand how protobuf works and it's structure and nested classes for Tron implementation. Take a look at node_modules/@tronscan/client/protobuf/core/Tron.proto 
You are interested in Transaction class. As you see it contains 2 fields.
 - raw_data (field number 1, type 'raw')
 - signature (field number 2, type 'repeated bytes')

If you have to parse such a hex message (with signature) you can do the following:
With signature:
```bash
# pacman -S extra/protobuf
cd ./node_modules/@tronscan/client/protobuf
echo 'long-hex-message-string-like-a30174b6c2223' | xxd -r -p - > message.bin
protoc --decode protocol.Transaction core/Tron.proto < message.bin
```
You can also use https://protobuf-decoder.netlify.app/ but it won't show you fields names.

Let's say we have to decode a hex transaction without a signature. We clearly see that it's a type of `raw` by the Tron.proto file, so we do:

```bash
protoc --decode protocol.Transaction.raw core/Tron.proto < message.bin
```


Lets review the hex of Tron network Smart contract. This is a typical hex representation of the message that's being sent to backend api. And it's a binary representation of protobuf format. 

| name                               | hex                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | description                                                                         |
|------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| Transaction                        | 0a 02 a5 91 22 08 71 30 31 ee 43 e2 4b 93 40 a0 95 dd ad a9 31 5a ae 01 08 1f 12 a9 01 0a 31 74 79 70 65 2e 67 6f 6f 67 6c 65 61 70 69 73 2e 63 6f 6d 2f 70 72 6f 74 6f 63 6f 6c 2e 54 72 69 67 67 65 72 53 6d 61 72 74 43 6f 6e 74 72 61 63 74 12 74 0a 15 41 7a 86 49 ab fa 3d 24 f8 d0 dc 70 d2 b6 d5 0e 4f 8a 6f 76 13 12 15 41 a6 14 f8 03 b6 fd 78 09 86 a4 2c 78 ec 9c 7f 77 e6 de d1 3c 22 44 a9 05 9c bb 00 00 00 00 00 00 00 00 00 00 00 00 1c 00 0d d5 6b 9e 63 4f e6 73 46 b8 90 45 99 0c b7 bb 82 1d 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 70 f4 c3 d9 ad a9 31 | Hex representation of protobuf transaction, which is sent as message to backend API |
| transaction.type                   | 74 79 70 65 2E 67 6F 6F 67 6C 65 61 70 69 73 2E 63 6F 6D 2F 70 72 6F 74 6F 63 6F 6C 2E 54 72 69 67 67 65 72 53 6D 61 72 74 43 6F 6E 74 72 61 63 74                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | type.googleapis.com/protocol.TriggerSmartContract                                   |
| transaction.sender_address         | 41 7a 86 49 ab fa 3d 24 f8 d0 dc 70 d2 b6 d5 0e 4f 8a 6f 76 13                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | hex(base58("TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht"))                                   |
| transaction.contract_address       | 41 a6 14 f8 03 b6 fd 78 09 86 a4 2c 78 ec 9c 7f 77 e6 de d1 3c                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | hex(base58("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"))                                   |
| transaction.param                  | a9 05 9c bb 00 00 00 00 00 00 00 00 00 00 00 00 1c 00 0d d5 6b 9e 63 4f e6 73 46 b8 90 45 99 0c b7 bb 82 1d 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01                                                                                                                                                                                                                                                                                                                                                                                                                            | ABI encoded 'param' field of TriggerSmartContract type protobuf                     |
| transaction.param.receiver_address | 1c 00 0d d5 6b 9e 63 4f e6 73 46 b8 90 45 99 0c b7 bb 82 1d                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | hex(base58("CXFzBg8XjZF2NUjDSzSxXLBxeZxgPpS5o")), first T is dropped                |

# Contributing
We deeply appreciate the valuable contributions made by our community. 
To provide feedback or report bugs, [kindly open a GitHub issue](https://github.com/kitzen-io/wallet-core-essentials/issues/new).
For code contributions, explore our "Contributing" guidelines and become part of our open-source community. 

Thank you to all the dedicated individuals who contribute; your passion drives our success. Together, we shape the future of web3 industry.


<a href="https://github.com/kitzen-io/wallet-core-essentials/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=kitzen-io/wallet-core-essentials&max=400&columns=20" />
  <img src="https://us-central1-tooljet-hub.cloudfunctions.net/github" width="0" height="0" />
</a>

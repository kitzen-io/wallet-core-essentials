# wallet-core-essentials
[![npm version](https://img.shields.io/npm/v/@graphql-portal/gateway?color=green)](https://www.npmjs.com/package/@graphql-portal/gateway)
[![from kitzen with Love](https://img.shields.io/badge/from%20kitzen%20with-%F0%9F%A4%8D-red)](https://kitzen.io/)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkitzen-io%2Fwallet-core-essentials.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkitzen-io%2Fwallet-core-essentials?ref=badge_shield)
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

# Contributing
We deeply appreciate the valuable contributions made by our community. 
To provide feedback or report bugs, [kindly open a GitHub issue](https://github.com/kitzen-io/wallet-core-essentials/issues/new).
For code contributions, explore our "Contributing" guidelines and become part of our open-source community. 

Thank you to all the dedicated individuals who contribute; your passion drives our success. Together, we shape the future of web3 industry.


<a href="https://github.com/kitzen-io/wallet-core-essentials/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=kitzen-io/wallet-core-essentials&max=400&columns=20" />
  <img src="https://us-central1-tooljet-hub.cloudfunctions.net/github" width="0" height="0" />
</a>

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkitzen-io%2Fwallet-core-essentials.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkitzen-io%2Fwallet-core-essentials?ref=badge_large)

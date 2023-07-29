/**
 * https://github.com/paulmillr/noble-secp256k1
 * implementation of Secp256k1 which is an elliptic curve used by Bitcoin to implement its public key cryptography.
 **/
import {utils} from '@noble/secp256k1';
import {crypto} from 'bitcoinjs-lib';
import createHmac from 'create-hmac';

utils.sha256Sync = (...messages) => {
  return crypto.sha256(Buffer.concat(messages));
};
utils.hmacSha256Sync = (key, ...messages) => {
  const hash = createHmac('sha256', Buffer.from(key));
  messages.forEach(m => hash.update(m));
  return Uint8Array.from(hash.digest());
};

export {utils};

import {
  concat,
  keccak256,
  sha256,
  Signature,
  SigningKey,
  toUtf8Bytes,
} from 'ethers';
import { Point } from '@noble/secp256k1';

export const TRON_MESSAGE_PREFIX = '\x19TRON Signed Message:\n';
export const ADDRESS_PREFIX = '41';
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const ALPHABET_MAP = {};

for (let i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET.charAt(i)] = i;
}

const BASE = 58;


export function hexChar2byte(c): number {
  let d;

  if (c >= 'A' && c <= 'F')
    d = c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
  else if (c >= 'a' && c <= 'f')
    d = c.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
  else if (c >= '0' && c <= '9')
    d = c.charCodeAt(0) - '0'.charCodeAt(0);

  if (typeof d === 'number')
    return d;
  else
    throw new Error('The passed hex char is not a valid hex char');
}

export function isHexChar(c): 1 | 0 {
  if ((c >= 'A' && c <= 'F') ||
    (c >= 'a' && c <= 'f') ||
    (c >= '0' && c <= '9')) {
    return 1;
  }

  return 0;
}

export function hexStr2byteArray(str, strict = false): number[] {
  if (typeof str !== 'string')
    throw new Error('The passed string is not a string');

  let len = str.length;

  if (strict) {
    if (len % 2) {
      str = `0${str}`;
      len++;
    }
  }
  const byteArray: number[] = Array(); // eslint-disable-line @typescript-eslint/no-array-constructor
  let d: number = 0;
  let j: number = 0;
  let k: number = 0;

  for (let i = 0; i < len; i++) {
    const c = str.charAt(i);

    if (isHexChar(c)) {
      d <<= 4;
      d += hexChar2byte(c);
      j++;

      if (0 === (j % 2)) {
        byteArray[k++] = d;
        d = 0;
      }
    } else
      throw new Error('The passed hex char is not a valid hex string');
  }

  return byteArray;
}

export function hashMessage(message): string {
  if (typeof (message) === 'string') {
    message = toUtf8Bytes(message);
  }

  if (Array.isArray(message)) {
    message = new Uint8Array(message);
  }

  return keccak256(concat([
    toUtf8Bytes(TRON_MESSAGE_PREFIX),
    toUtf8Bytes(String(message.length)),
    message,
  ]));
}

export function signMessage(message, privateKey): string {
  if (!privateKey.match(/^0x/)) {
    privateKey = '0x' + privateKey;
  }

  const signingKey = new SigningKey(privateKey);
  const messageDigest = hashMessage(message);
  const signature = signingKey.sign(messageDigest);

  return Signature.from(signature).serialized;
}

export function computeAddress(pubBytes): number[] {
  if (pubBytes.length === 65)
    pubBytes = pubBytes.slice(1);

  const hash = keccak256(new Uint8Array(pubBytes)).toString().substring(2);
  const addressHex = ADDRESS_PREFIX + hash.substring(24);

  return hexStr2byteArray(addressHex);
}

export function byte2hexStr(byte): string {
  if (typeof byte !== 'number')
    throw new Error('Input must be a number');

  if (byte < 0 || byte > 255)
    throw new Error('Input must be a byte');

  const hexByteMap = '0123456789ABCDEF';

  let str = '';
  str += hexByteMap.charAt(byte >> 4);
  str += hexByteMap.charAt(byte & 0x0f);

  return str;
}



export function byteArray2hexStr(byteArray): string {
  let str: string = '';

  for (let i = 0; i < (byteArray.length); i++)
    str += byte2hexStr(byteArray[i]);

  return str;
}

export function decode58(string): number[] {
  if (string.length === 0)
    return [];

  let i;
  let j;

  const bytes = [0];

  for (i = 0; i < string.length; i++) {
    const c = string[i];

    if (!(c in ALPHABET_MAP))
      throw new Error('Non-base58 character');

    for (j = 0; j < bytes.length; j++)
      bytes[j] *= BASE;

    bytes[0] += ALPHABET_MAP[c];
    let carry = 0;

    for (j = 0; j < bytes.length; ++j) {
      bytes[j] += carry;
      carry = bytes[j] >> 8;
      bytes[j] &= 0xff;
    }

    while (carry) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }

  for (i = 0; string[i] === '1' && i < string.length - 1; i++)
    bytes.push(0);

  return bytes.reverse();
}


// eslint-ignore  camelCase(@typescript-eslint/naming-convention)
export function SHA256(msgBytes): number[] {
  const msgHex = byteArray2hexStr(msgBytes);
  const hashHex = sha256('0x' + msgHex).replace(/^0x/, '');
  return hexStr2byteArray(hashHex);
}

export function decodeBase58Address(base58Sting): false | number[] {
  if (typeof (base58Sting) != 'string')
    return false;

  if (base58Sting.length <= 4)
    return false;

  let address = decode58(base58Sting);

  if (base58Sting.length <= 4)
    return false;

  const len = address.length;
  const offset = len - 4;
  const checkSum = address.slice(offset);

  address = address.slice(0, offset);

  const hash0 = SHA256(address);
  const hash1 = SHA256(hash0);
  const checkSum1 = hash1.slice(0, 4);

  if (checkSum[0] == checkSum1[0] && checkSum[1] == checkSum1[1] && checkSum[2] ==
    checkSum1[2] && checkSum[3] == checkSum1[3]
  ) {
    return address;
  }

  throw new Error('Invalid address provided');
}


export function encode58(buffer): string {
  if (buffer.length === 0)
    return '';

  let i;
  let j;

  const digits = [0];

  for (i = 0; i < buffer.length; i++) {
    for (j = 0; j < digits.length; j++)
      digits[j] <<= 8;

    digits[0] += buffer[i];
    let carry = 0;

    for (j = 0; j < digits.length; ++j) {
      digits[j] += carry;
      carry = (digits[j] / BASE) | 0;
      digits[j] %= BASE;
    }

    while (carry) {
      digits.push(carry % BASE);
      carry = (carry / BASE) | 0;
    }
  }

  for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++)
    digits.push(0);

  return digits.reverse().map(digit => ALPHABET[digit]).join('');
}


export function getSha256(msgBytes): number[] {
  const msgHex = byteArray2hexStr(msgBytes);
  const hashHex = sha256('0x' + msgHex).replace(/^0x/, '');
  return hexStr2byteArray(hashHex);
}

export function getBase58CheckAddress(addressBytes): string {
  const hash0 = getSha256(addressBytes);
  const hash1 = getSha256(hash0);

  let checkSum = hash1.slice(0, 4);
  checkSum = addressBytes.concat(checkSum);

  return encode58(checkSum);
}

function normalizePrivateKeyBytes(priKeyBytes): number[] {
  return hexStr2byteArray(byteArray2hexStr(priKeyBytes).padStart(64, '0'));
}

export function getPubKeyFromPriKey(priKeyBytes): number[] {
  const pubkey = Point.fromPrivateKey(new Uint8Array(normalizePrivateKeyBytes(priKeyBytes)));
  const x = pubkey.x;
  const y = pubkey.y;

  let xHex = x.toString(16).padStart(64, '0');
  let yHex = y.toString(16).padStart(64, '0');

  const pubkeyHex = `04${xHex}${yHex}`;
  const pubkeyBytes = hexStr2byteArray(pubkeyHex);

  return pubkeyBytes;
}

export function getAddressFromPriKey(priKeyBytes): number[] {
  let pubBytes = getPubKeyFromPriKey(priKeyBytes);
  return computeAddress(pubBytes);
}

export function pkToAddress(privateKey, strict = false): string {
  const comPriKeyBytes = hexStr2byteArray(privateKey, strict);
  const comAddressBytes = getAddressFromPriKey(comPriKeyBytes);

  return getBase58CheckAddress(comAddressBytes);
}

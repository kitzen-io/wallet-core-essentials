import {utils} from './secp';
import {
  Point,
  getPublicKey,
  signSync,
  schnorr,
  verify
} from '@noble/secp256k1';
import {TinySecp256k1Interface as Bip32TinySecp256k1Interface} from "bip32";
import {TinySecp256k1Interface as EcPairTinySecp256k1Interface} from "ecpair";

const defaultTrue = (param: any) => param !== false;

function throwToNull(fn: Function) {
  try {
    return fn();
  } catch (e) {
    return null;
  }
}

function _isPoint(p: Uint8Array | string, xOnly: boolean) {
  if ((p.length === 32) !== xOnly) return false;
  try {
    return !!Point.fromHex(p);
  } catch (e) {
    return false;
  }
}

export const ecc: Bip32TinySecp256k1Interface & EcPairTinySecp256k1Interface = {
  isPoint: (p: Uint8Array): boolean => _isPoint(p, false),
  isPrivate: (d: Uint8Array): boolean => utils.isValidPrivateKey(d),
  pointFromScalar: (sk: Uint8Array, compressed?: boolean): Uint8Array | null =>
    throwToNull(() => getPublicKey(sk, defaultTrue(compressed))),
  pointCompress: (p: Uint8Array, compressed?: boolean): Uint8Array => {
    return Point.fromHex(p).toRawBytes(defaultTrue(compressed));
  },
  pointAddScalar: (p: Uint8Array, tweak: Uint8Array, compressed?: boolean): Uint8Array | null =>
    throwToNull(() =>
      utils.pointAddScalar(p, tweak, defaultTrue(compressed))
    ),
  privateAdd: (d: Uint8Array, tweak: Uint8Array): Uint8Array | null => throwToNull(() => utils.privateAdd(d, tweak)),
  sign: (h: Uint8Array, d: Uint8Array, e?: Uint8Array): Uint8Array => {
    return signSync(h, d, {der: false, extraEntropy: e});
  },
  signSchnorr: (h: string | Uint8Array, d: string | Uint8Array, e = Buffer.alloc(32, 0x00)) => {
    return schnorr.signSync(h, d, e);
  },
  verify: (h: string | Uint8Array, Q: string | Uint8Array, signature: string | Uint8Array, strict: boolean) => {
    return verify(signature, h, Q, {strict});
  },
  verifySchnorr: (h: string | Uint8Array, Q: string | Uint8Array, signature: string | Uint8Array) => {
    return schnorr.verifySync(signature, h, Q);
  }
  // pointMultiply: (a, tweak, compressed) =>
  //   throwToNull(() =>
  //     utils.pointMultiply(a, tweak, defaultTrue(compressed))
  //   ),
  // pointAdd: (a, b, compressed) =>
  //   throwToNull(() => {
  //     const A = Point.fromHex(a);
  //     const B = Point.fromHex(b);
  //     return A.add(B).toRawBytes(defaultTrue(compressed));
  //   }),
  // isXOnlyPoint: p => _isPoint(p, true),
  // xOnlyPointAddTweak: (p, tweak) =>
  //   throwToNull(() => {
  //     const P = utils.pointAddScalar(p, tweak, true);
  //     const parity = P[0] % 2 === 1 ? 1 : 0;
  //     return {parity, xOnlyPubkey: P.slice(1)};
  //   }),
  // privateNegate: (d: string | Uint8Array | bigint | number) => utils.privateNegate(d),
};

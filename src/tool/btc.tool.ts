// import { BIP32Factory, BIP32Interface } from 'bip32';
// import * as bip39 from '@/crypto/bip39';
//
// import { ecc } from '@/crypto/ecc';
//
// export interface IBip32Derivation {
//     masterFingerprint: Buffer;
//     path: string;
//     pubkey: Buffer;
// }
//
//
// const MAX_DERIVATION_ADDRESS_INDEX: number = Math.pow(2, 31) - 1;
// const DEFAULT_PATH = 'm/84\'/0\'/0\'/0/0';
//
// const randomFromInterval = (min: number, max: number): number => {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// };
//
// const getRandomDerivationIndex = (): number => {
//  return randomFromInterval(1, MAX_DERIVATION_ADDRESS_INDEX);
// };
//
// const getHDRoot = async (mnemonic: string): Promise<BIP32Interface> => {
//   const bip32 = BIP32Factory(ecc);
//
//   const seed: Buffer = await bip39.mnemonicToSeed(mnemonic);
//
//   return bip32.fromSeed(seed);
// }
//
// const getDerivation = async ({ mnemonic, hdRoot }: {mnemonic: string; hdRoot?: BIP32Interface}, derivationPath: string = DEFAULT_PATH): Promise<IBip32Derivation> => {
//   if (!hdRoot && !mnemonic) throw new Error('Can\'t get derivation, missed params');
//
//   if (!hdRoot) hdRoot = await getHDRoot(mnemonic);
//
//   const masterFingerprint: Buffer = hdRoot.fingerprint;
//   const { publicKey } = hdRoot.derivePath(derivationPath);
//
//   return {
//     masterFingerprint,
//     path: derivationPath,
//     pubkey: publicKey,
//   };
// }
//
// export {
//   DEFAULT_PATH,
//   getDerivation,
//   getHDRoot,
//   getRandomDerivationIndex,
//   randomFromInterval,
// };

import { ECPairFactory } from 'ecpair';
import BIP32Factory, { BIP32API } from 'bip32';
import { ECPairAPI } from 'ecpair/src/ecpair';

import { ecc } from './ecc';
import { Btc } from './btc';
import { BIP39API } from '../interface/interfaces';
import { Tron } from '../tron/trx';


export class CryptoFactory {
  private static ecPair?: ECPairAPI;

  private static bip32?: BIP32API;

  private static btc?: Btc;

  private static bip39?: BIP39API;

  private static tronWeb?: Tron;

  public static getEcPair(): ECPairAPI {
    if (!CryptoFactory.ecPair) {
      CryptoFactory.ecPair = ECPairFactory(ecc);
    }
    return CryptoFactory.ecPair;
  }

  public static getTrx(): Tron {
    if (!CryptoFactory.tronWeb) {
      CryptoFactory.tronWeb = new Tron();
    }
    return CryptoFactory.tronWeb;
  }

  public static getBip32(): BIP32API {
    if (!CryptoFactory.bip32) {
      CryptoFactory.bip32 = BIP32Factory(ecc);
    }
    return CryptoFactory.bip32;
  }

  public static setBip39(bip39: BIP39API): void {
    CryptoFactory.bip39 = bip39;
  }

  public static getBip39(): BIP39API {
    if (!CryptoFactory.bip39) {
      throw Error('Factory was not initialized');
    }
    return CryptoFactory.bip39;
  }

  public static getBtc(): Btc {
    if (!CryptoFactory.btc) {
      let ecPair = CryptoFactory.getEcPair();
      let bip32 = CryptoFactory.getBip32();
      let bip39 = CryptoFactory.getBip39();
      CryptoFactory.btc = new Btc(ecPair, bip32, bip39);
    }
    return CryptoFactory.btc;
  }
}

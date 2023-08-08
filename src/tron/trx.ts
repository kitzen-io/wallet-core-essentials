import { signMessage, pkToAddress } from './tronweb';
import { Address } from '../interface/interfaces';

export class Tron {
  public getAddressFromPrivateKey(privateKeyHex: string): Address[] {
    let address = pkToAddress(privateKeyHex);
    return [{ address, derivePath: "m/84'/0'/0'/0/0" }];
  }

  public signMessage(message: string, privateKeyHex: string): string {
    return signMessage(message, privateKeyHex);
  }
}


// @ts-ignore
import TronWeb from 'tronweb/dist/TronWeb';
import { Address } from '../interface/interfaces';

export class Tron {
  public getAddressFromPrivateKey(privateKeyHex: string): Address[] {
    let address = TronWeb.address.fromPrivateKey(privateKeyHex);
    return [{ address, derivePath: "m/84'/0'/0'/0/0" }];
  }

  public signMessage(message: string, privateKeyBase58: string): string {
    return TronWeb.utils.message.signMessage(message, privateKeyBase58);
  }
}


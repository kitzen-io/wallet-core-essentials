import { signMessage, pkToAddress } from './tronweb';
import { Address } from '../interface/interfaces';
import { DEFAULT_DERIVE_PATH } from '../tool/consts';

export class Tron {
  public getAddressFromPrivateKey(privateKeyHex: string): Address[] {
    let address = pkToAddress(privateKeyHex);
    return [{ address, derivePath: DEFAULT_DERIVE_PATH }];
  }

  public signMessage(message: string, privateKeyHex: string): string {
    return signMessage(message, privateKeyHex);
  }
}


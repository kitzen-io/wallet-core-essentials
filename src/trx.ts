// @ts-ignore
import TronWeb from "tronweb/dist/TronWeb";
import {Address} from "./interfaces";

export class Trx {
  getAddressFromPrivateKey(privateKeyHex: string): Address[] {
    let address = TronWeb.address.fromPrivateKey(privateKeyHex);
    return [{address, derivePath: "m/84'/0'/0'/0/0"}];
  }
}

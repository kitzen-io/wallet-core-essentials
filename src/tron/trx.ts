import {
  byteArray2hexStr,
  decodeBase58Address,
  pkToAddress,
  signMessage,
} from './tronweb';
import { Address } from '../interface/interfaces';

export class Tron {
  public getAddressFromPrivateKey(privateKeyHex: string): Address[] {
    let address = pkToAddress(privateKeyHex);
    return [{ address, derivePath: "m/84'/0'/0'/0/0" }];
  }

  public signMessage(message: string, privateKeyHex: string): string {
    return signMessage(message, privateKeyHex);
  }

  public toHex(publicAddress: string): string {
    return byteArray2hexStr(decodeBase58Address(publicAddress));
  }


  public createTrXTransaction({ to, amount, from }: { to: string; amount: number; from: string }): any {
    const data = {
      to_address: this.toHex(to),
      owner_address: this.toHex(from),
      amount: amount,
    };
    return data;
  }



  // public static async createTrxTransaction(msg: IMessageWithPort<ICreateTransactionExtensionMessageData>): Promise<void> {
  //   try {
  //     const {
  //       data: { address, amount },
  //     } = msg;
  //
  //     const network = BlockchainNetworkEnum.TRC10;
  //     const identifier = 'coin';
  //     const data: IUserBalanceResponse = await BlockchainService.getBalance(network, identifier);
  //
  //     const trxBalance = data.find((asset) => asset.network === network && asset.identifier === identifier).balance;
  //
  //     const { estimatedAmountOfTrx } = await Trx.estimateRequiredFeeTrx({
  //       to: address,
  //       amount: amount.toString(),
  //       network,
  //       identifier,
  //     });
  //
  //     if (BigInt(trxBalance) < BigInt(amount) || BigInt(amount) <= BigInt(estimatedAmountOfTrx)) {
  //       throw new Error(TransactionErrorsEnum.INSUFFICIENT_TRX_FUNDS);
  //     }
  //
  //     const transaction = await Trx.createTrxTransaction({
  //       to: address,
  //       amount: (BigInt(amount) - BigInt(estimatedAmountOfTrx) - BigInt(1000)).toString(),
  //       network,
  //       identifier,
  //     });
  //
  //     const txId = await BlockchainService.broadcast(transaction, network);
  //
  //     msg.response!({ success: true });
  //   } catch (e) {
  //     console.log(e);
  //     msg.response!({ success: false, error: e.message });
  //   }
  // }
}


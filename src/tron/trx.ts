import {
  byteArray2hexStr,
  decodeBase58Address,
  pkToAddress,
  signMessage,
} from './tronweb';
import {
  Address,
  CreateTrxTransactionParams,
} from '../interface/interfaces';

import google_protobuf_any_pb from 'google-protobuf/google/protobuf/any_pb.js';
import {
  decode58Check,
  signTransaction,
} from '@tronscan/client/src/utils/crypto';
import { TransferContract } from '@tronscan/client/src/protocol/core/Contract_pb';
import { Transaction } from '@tronscan/client/src/protocol/core/Tron_pb';


export class Tron {
  public getAddressFromPrivateKey(privateKeyHex: string): Address[] {
    let address = pkToAddress(privateKeyHex);
    return [{ address, derivePath: "m/84'/0'/0'/0/0" }];
  }

  public signMessage(message: string, privateKeyHex: string): string {
    return signMessage(message, privateKeyHex);
  }

  public toHex(value: string): string {
    return byteArray2hexStr(decodeBase58Address(value));
  }

  public hexToUnitArray(hexString: string): Uint8Array {
    // https://stackoverflow.com/a/50868276/3872976
    return new Uint8Array(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
  }

  public createTrxTransaction(args: CreateTrxTransactionParams): any {
    // this method will create a transaction with required fields on Tron network
    // example of required fields can be checked in TronAPI
    // https://developers.tron.network/reference/broadcasttransaction
    let transferContract = new TransferContract();
    transferContract.setToAddress(Uint8Array.from(decode58Check(args.to)));
    transferContract.setOwnerAddress(Uint8Array.from(decode58Check(args.from)));
    transferContract.setAmount(args.amount);
    let anyValue = new google_protobuf_any_pb.Any();
    anyValue.pack(transferContract.serializeBinary(), 'protocol.TransferContract');
    let contract = new Transaction.Contract();
    contract.setType(Transaction.Contract.ContractType.TRANSFERCONTRACT);
    contract.setParameter(anyValue);
    let raw = new Transaction.raw();
    raw.addContract(contract);
    let data = args.blockInfo;
    // get Hex representation of a number with toString(16)
    // and get last 4 bytes, if there are less bytes fill left bytes with 0

    // this part is portially from TronWeb
    // https://github.com/kitzen-io/tronweb/blob/180e87e6b580d2ce2b00d2eea2d966a808d94657/src/lib/transactionBuilder.js#L80
    //
    let hexRefBlockEnd = data.block_header.raw_data.number.toString(16).slice(-4).padStart(4, '0');
    raw.setRefBlockBytes(this.hexToUnitArray(hexRefBlockEnd)); // Set refBlockBytes using block number
    raw.setRefBlockHash(this.hexToUnitArray(data.blockID.slice(16, 32))); // Set refBlockBytes using block number
    // 1 minute should be enough to finish transaction
    raw.setExpiration(data.block_header.raw_data.timestamp + 60 * 1000); // Set refBlockBytes using block number
    raw.setTimestamp(data.block_header.raw_data.timestamp); // Set refBlockBytes using block number
    let transaction = new Transaction();
    transaction.setRawData(raw);
    return transaction;
  }

  public signTransaction(transaction: any, privateKey: string): string {
    let a = signTransaction(privateKey, transaction);
    return a.hex;
  }
}


import {
  decode58Check,
  pkToAddress,
  signTransaction,
} from '@tronscan/client/src/utils/crypto';
import {
  Address,
  CreateTrxTransactionParams,
} from '../interface/interfaces';

import { Any } from 'google-protobuf/google/protobuf/any_pb.js';
import { TransferContract } from '@tronscan/client/src/protocol/core/Contract_pb';
import { Transaction } from '@tronscan/client/src/protocol/core/Tron_pb';
import {
  concat,
  keccak256,
  Signature,
  SigningKey,
  toUtf8Bytes,
} from 'ethers';
import { ITronGetBlockResponse } from '@kitzen/data-transfer-objects';


export class Tron {
  public getAddressFromPrivateKey(privateKeyHex: string): Address[] {
    let address = pkToAddress(privateKeyHex);
    return [{ address, derivePath: "m/84'/0'/0'/0/0" }];
  }

  public signMessage(message: string, privateKeyHex: string): string {
    if (!privateKeyHex.match(/^0x/)) {
      privateKeyHex = '0x' + privateKeyHex;
    }

    const signingKey = new SigningKey(privateKeyHex);
    const messageDigest = this.hashMessage(message);
    const signature = signingKey.sign(messageDigest);

    return Signature.from(signature).serialized;
  }

  public createTrxTransaction(args: CreateTrxTransactionParams): any {
    // this method will create a transaction with required fields on Tron network
    // example of required fields can be checked in TronAPI
    // https://developers.tron.network/reference/broadcasttransaction
    const transferContract = new TransferContract();
    transferContract.setToAddress(Uint8Array.from(decode58Check(args.to)));
    transferContract.setOwnerAddress(Uint8Array.from(decode58Check(args.from)));
    transferContract.setAmount(args.amount);

    const protoBufTransferContract = new Any();
    // node_modules/@tronscan/client/protobuf/core/Tron.proto
    // pack(binary, 'package.message')
    protoBufTransferContract.pack(transferContract.serializeBinary(), 'protocol.TransferContract');
    const contract = new Transaction.Contract();
    contract.setType(Transaction.Contract.ContractType.TRANSFERCONTRACT);
    contract.setParameter(protoBufTransferContract);

    const transactionRaw = new Transaction.raw();
    transactionRaw.addContract(contract);
    this.addRefBlockToTransaction(args.blockInfo, transactionRaw);
    const transaction = new Transaction();
    transaction.setRawData(transactionRaw);
    return transaction;
  }

  public signTransaction(transaction: any, privateKey: string): string {
    let a = signTransaction(privateKey, transaction);
    return a.hex;
  }

  private hashMessage(message): string {
    const TRON_MESSAGE_PREFIX = '\x19TRON Signed Message:\n';
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

  private hexToUnitArray(hexString: string): Uint8Array {
    // https://stackoverflow.com/a/50868276/3872976
    return new Uint8Array(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
  }

  private addRefBlockToTransaction(data: ITronGetBlockResponse, rawTransaction): void {
    // get Hex representation of a number with toString(16)
    // and get last 4 bytes, if there are fewer bytes - fill left bytes with 0

    // this part is partially from TronWeb
    // https://github.com/kitzen-io/tronweb/blob/180e87e6b580d2ce2b00d2eea2d966a808d94657/src/lib/transactionBuilder.js#L80
    //
    let hexRefBlockEnd = data.block_header.raw_data.number.toString(16).slice(-4).padStart(4, '0');

    rawTransaction.setRefBlockBytes(this.hexToUnitArray(hexRefBlockEnd)); // Set refBlockBytes using block number
    rawTransaction.setRefBlockHash(this.hexToUnitArray(data.blockID.slice(16, 32))); // Set refBlockBytes using block number
    // 1 minute should be enough to finish transaction
    rawTransaction.setExpiration(data.block_header.raw_data.timestamp + 60 * 1000); // Set refBlockBytes using block number
    rawTransaction.setTimestamp(data.block_header.raw_data.timestamp); // Set refBlockBytes using block number
  }
}


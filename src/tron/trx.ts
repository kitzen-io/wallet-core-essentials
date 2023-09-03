import {
  decode58Check,
  pkToAddress,
  signTransaction,
} from '@tronscan/client/src/utils/crypto';
import {
  Address,
  CreateTrxTransactionParams,
  EstimateTransactionFeeProps,
} from '../interface/interfaces';
import { byteArray2hexStr } from '@tronscan/client/src/utils/bytes';

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

  // Tron address is 34 characters length, starting with T
  // https://datatracker.ietf.org/doc/id/draft-msporny-base58-02.txt
  // this is base58 base characters, no l, 0, O, etc
  private addressRegex = /T[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{33}/;

  // this one is used for calculation transaction fee
  private dummyBlockInfo: ITronGetBlockResponse = {
    'blockID': '00000000033c4d794602b25f8a1dad64e46b750ffe0452ee6d712ad41a816bae',
    'block_header': {
      'raw_data': {
        'number': 54283641,
        'txTrieRoot': '558b89b6192b0febef6bca019b0b7e41db4c7272b14a525569e2ce459c4b1979',
        'witness_address': '414ce8225c8ea6c8e1e0a483132211610c765fc6df',
        'parentHash': '00000000033c4d78e8fd3131520aecebe3449d84a7c08b8b0fe21fa2bf5e4eca',
        'version': 28,
        'timestamp': 1693481151000,
      },
      'witness_signature': 'a6ce36655266bb344aff4f0687fb281d77dfc17cae590fd1472f32f294e384c563f5c8cc46c97736b81cb51d68296f6c3126b0d231765927d041f04a26da77dc00',
    },
  };


  public getAddressFromPrivateKey(privateKeyHex: string): Address[] {
    let address = pkToAddress(privateKeyHex);
    return [{ address, derivePath: "m/84'/0'/0'/0/0" }];
  }

  // used in backend
  public base58toHex(value: string): string {
    return byteArray2hexStr(decode58Check(value));
  }

  public validateAddress(address: string): boolean {
    return this.addressRegex.test(address);
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

  public estimateTransactionFee({ accountResources, ...parameters }: EstimateTransactionFeeProps): number {
    let transaction = this.createTrxTransaction({
      from: parameters.from,
      amount: parameters.amount,
      to: parameters.to,
      blockInfo: this.dummyBlockInfo,
    });
    const transactionHex = this.signTransaction(transaction, parameters.privateKeyHex);
    // const availableEnergy = parameters.accountResources.TotalEnergyLimit - parameters.accountResources.TotalEnergyWeight;
    const availableBandwidth = accountResources.TotalNetLimit - accountResources.TotalNetWeight + accountResources.freeNetLimit;

    // This magic numbers were extracted from @kitzen/webExt, I don't do credit about whether it works or not
    const howManyBandwidthNeed = Math.round(transactionHex.length / 2) + 68;

    const paidBandwidth = howManyBandwidthNeed < availableBandwidth ? 0 : Math.round(Math.abs(availableBandwidth - howManyBandwidthNeed));
    return paidBandwidth * 1000;
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

  private hexToUnsignedIntArray(hexString: string): Uint8Array {
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

    rawTransaction.setRefBlockBytes(this.hexToUnsignedIntArray(hexRefBlockEnd)); // Set refBlockBytes using block number
    rawTransaction.setRefBlockHash(this.hexToUnsignedIntArray(data.blockID.slice(16, 32))); // Set refBlockBytes using block number
    // 1 minute should be enough to finish transaction
    rawTransaction.setExpiration(data.block_header.raw_data.timestamp + 60 * 1000); // Set refBlockBytes using block number
    rawTransaction.setTimestamp(data.block_header.raw_data.timestamp); // Set refBlockBytes using block number
  }
}


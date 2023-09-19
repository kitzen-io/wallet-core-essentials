import {
  decode58Check,
  getBase58CheckAddress,
  isAddressValid,
  pkToAddress,
  signTransaction,
} from '@tronscan/client/src/utils/crypto';
import {
  Address,
  CreateTrc10TransactionParams,
  CreateTrc20TransactionParams,
  CreateTrxTransactionParams,
  DecodeContractDataParam,
  DecodeContractDataResult,
  EstimateTransactionFeeProps,
  GetTriggerConstantContractParams,
  GetTriggerConstantContractResponse,
} from '../interface/interfaces';
import { byteArray2hexStr } from '@tronscan/client/src/utils/bytes';
import {
  BlockchainNetworkEnum,
  ITronGetBlockResponse,
} from '@kitzen/data-transfer-objects';

import { Any } from 'google-protobuf/google/protobuf/any_pb.js';
import { TransferContract } from '@tronscan/client/src/protocol/core/Contract_pb';
import {
  SmartContract,
  Transaction,
} from '@tronscan/client/src/protocol/core/Tron_pb';
import {
  AbiCoder,
  concat,
  keccak256,
  Signature,
  SigningKey,
  toUtf8Bytes,
} from 'ethers';


export class Tron {

  private static ADDRESS_PREFIX = '41';

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


  public hexToBase58(value: string): string {
    return getBase58CheckAddress(this.hexToByteArray(value));
  }

  public decodeContractData(value: DecodeContractDataParam): DecodeContractDataResult {
    if (!value.data) {
      return {
        fromAddress: this.hexToBase58(value.owner_address),
        amount: BigInt(value.amount),
        toAddress: this.hexToBase58(value.to_address),
      };
    }
    const decodedParams = this.decodeParams(['address', 'uint256'], value.data, true);
    return {
      fromAddress: this.hexToBase58(value.owner_address),
      toAddress: this.hexToBase58(decodedParams[0]),
      amount: decodedParams[1],
    };
  }

  private decodeParams(types, output, ignoreMethodHash): any[] {
    if (!output || typeof output === 'boolean') {
      ignoreMethodHash = output;
      output = types;
    }

    if (ignoreMethodHash && output.replace(/^0x/, '').length % 64 === 8) {
      output = `0x${output.replace(/^0x/, '').substring(8)}`;
    }

    const abiCoder = new AbiCoder();

    if (output.replace(/^0x/, '').length % 64) {
      throw new Error('The encoded string is not valid. Its length must be a multiple of 64.');
    }
    return abiCoder.decode(types, output).reduce((obj, arg, index) => {
      if (types[index] === 'address') {
        arg = Tron.ADDRESS_PREFIX + arg.substr(2).toLowerCase();
      }
      obj.push(arg);
      return obj;
    }, []);
  }


  public getAddressFromPrivateKey(privateKeyHex: string): Address[] {
    let address = pkToAddress(privateKeyHex);
    return [{ address, derivePath: "m/84'/0'/0'/0/0" }];
  }

  // used in backend
  public base58toHex(value: string): string {
    return byteArray2hexStr(decode58Check(value));
  }

  public validateAddress(address: string): boolean {
    return isAddressValid(address);
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
    // https://developers.tron.network/reference/estimateenergy-2
    let transaction = this.createTrxTransaction({
      from: parameters.from,
      amount: parameters.amount,
      to: parameters.to,
      blockInfo: this.dummyBlockInfo,
      network: parameters.network,
      contractAddress: parameters.contractAddress,
      feeLimit: parameters.feeLimit, // this can be any number due estimation
    });

    // https://developers.tron.network/docs/faq#5-how-to-calculate-the-bandwidth-and-energy-consumed-when-calling-the-contract
    // 5. How to calculate the bandwidth and energy consumed when calling the contract?

    const DATA_HEX_PROTOBUF_EXTRA = 3; // extra data to transaction when it's stored in blockchain
    const MAX_RESULT_SIZE_IN_TX = 64; // 64 is the number of bytes occupied by the transaction result.
    const A_SIGNATURE = 67; // signature is always 65 bytes + 2 bytes to mark the field start in protobuf
    // you can check the hex transaction here https://protobuf-decoder.netlify.app/ (2 hex chars = 1 byte)
    // assuming 1 signature of transaction + data from docs above
    const howManyBandwidthNeed = transaction.serializeBinary().length + DATA_HEX_PROTOBUF_EXTRA + MAX_RESULT_SIZE_IN_TX + A_SIGNATURE;

    const availableEnergy = accountResources.EnergyLimit - accountResources.EnergyUsed;
    const availableBandwidth = accountResources.freeNetLimit + accountResources.NetLimit - (accountResources.NetUsed + accountResources.freeNetUsed);

    const paidBandwidth = howManyBandwidthNeed < availableBandwidth ? 0 : howManyBandwidthNeed - availableBandwidth;
    const paidEnergy = parameters.energyNeeded < availableEnergy ? 0 : parameters.energyNeeded - availableEnergy;

    return paidBandwidth * parameters.bandwidthPrice + paidEnergy * parameters.energyPrice;
  }

  public createTrc10Transaction(args: CreateTrc10TransactionParams): any {
    // this method will create a transaction with required fields on Tron network
    // example of required fields can be checked in TronAPI
    // https://developers.tron.network/reference/broadcasttransaction
    const transferContract = new TransferContract();
    transferContract.setToAddress(Uint8Array.from(decode58Check(args.to)));
    transferContract.setOwnerAddress(Uint8Array.from(decode58Check(args.from)));
    transferContract.setAmount(args.amount);

    const parameter = new Any();
    // node_modules/@tronscan/client/protobuf/core/Tron.proto
    // pack(binary, 'package.message')
    parameter.pack(transferContract.serializeBinary(), 'protocol.TransferContract');

    return this.packTransactionContract(
      parameter,
      args.blockInfo,
      Transaction.Contract.ContractType.TRANSFERCONTRACT,
      args.feeLimit,
    );
  }

  public createTrxTransaction(args: CreateTrxTransactionParams): any {
    if (args.network == BlockchainNetworkEnum.TRC20 && args.contractAddress) {
      return this.createTrc20Transaction(args as CreateTrc20TransactionParams);
    } else if (args.network === BlockchainNetworkEnum.TRC10) {
      return this.createTrc10Transaction(args);
    } else {
      throw Error(`Unsupported network ${args.network}`);
    }
  }

  public getTriggerConstantContractRequest(args: GetTriggerConstantContractParams): GetTriggerConstantContractResponse {
    const parameter = this.encodeSmartContractParams(args.to, args.amount);
    return {
      owner_address: args.ownerAddress,
      contract_address: args.contractAddress,
      function_selector: 'transfer(address,uint256)',
      parameter,
      visible: true,
    };
  }

  public createTrc20Transaction(args: CreateTrc20TransactionParams): any {
    // To understand the magic that goes here, you have to carefuly read Tron protocol documentation in
    // https://github.com/tronprotocol/documentation-en/blob/master/docs/contracts/trc20.md
    // as well as Protobuf structure in node_modules/@tronscan/client/protobuf/core/Tron.proto

    // We want to call Trc20 Smart Contract function transfer(address _to, uint _value) returns (bool success);
    const smartContract = new SmartContract();
    smartContract.setOriginAddress(Uint8Array.from(decode58Check(args.from)));

    const data = this.encodeSmartContractBytecode(args.to, args.amount);
    smartContract.setBytecode(data);
    smartContract.setContractAddress(Uint8Array.from(decode58Check(args.contractAddress)));
    // google.protobuf.Any parameter = 2;
    const parameter = new Any();
    // pack(binary, 'package.Class')
    parameter.pack(smartContract.serializeBinary(), 'protocol.TriggerSmartContract');
    return this.packTransactionContract(
      parameter,
      args.blockInfo,
      Transaction.Contract.ContractType.TRIGGERSMARTCONTRACT,
      args.feeLimit,
    );
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

  private addRefBlockToTransaction(data: ITronGetBlockResponse, rawTransaction, feeLimit: number): void {
    // get Hex representation of a number with toString(16)
    // and get last 4 bytes, if there are fewer bytes - fill left bytes with 0

    // this part is partially from TronWeb
    // https://github.com/kitzen-io/tronweb/blob/180e87e6b580d2ce2b00d2eea2d966a808d94657/src/lib/transactionBuilder.js#L80
    let hexRefBlockEnd = data.block_header.raw_data.number.toString(16).slice(-4).padStart(4, '0');
    rawTransaction.setRefBlockBytes(this.hexToUnsignedIntArray(hexRefBlockEnd)); // bytes ref_block_bytes = 1;
    rawTransaction.setRefBlockHash(this.hexToUnsignedIntArray(data.blockID.slice(16, 32))); // bytes ref_block_hash = 4;
    // 1 minute by protocol
    rawTransaction.setExpiration(data.block_header.raw_data.timestamp + 60 * 1000); // int64 expiration = 8;
    rawTransaction.setTimestamp(data.block_header.raw_data.timestamp); // int64 timestamp = 14;
    rawTransaction.setFeeLimit(feeLimit);
  }

  private packTransactionContract(parameter: Any, blockInfo: ITronGetBlockResponse, contractType: number, feeLimit: number): any {
    // message protocol.Transaction.Contract
    const contract = new Transaction.Contract();
    contract.setType(contractType);
    contract.setParameter(parameter);

    // message protocol.Transaction.raw
    const transactionRaw = new Transaction.raw();
    transactionRaw.addContract(contract);
    this.addRefBlockToTransaction(blockInfo, transactionRaw, feeLimit);

    // message protocol.Transaction
    const transaction = new Transaction();
    transaction.setRawData(transactionRaw);
    return transaction;
  }

  /*
   * Encodes node_modules/@tronscan/client/protobuf/core/Tron.proto
   * message SmartContract {
   *    bytes bytecode = 4;
   * }
   * */
  private encodeSmartContractBytecode(to: string, amount: string): Uint8Array {
    // https://developers.tron.network/docs/parameter-and-return-value-encoding-and-decoding
    // according to doc https://github.com/tronprotocol/documentation-en/blob/master/docs/contracts/trc20.md
    // function transfer(address _to, uint _value) returns (bool success);
    let functionName = keccak256(Buffer.from('transfer(address,uint256)', 'utf-8')).toString().substring(2, 10);
    let functionParams = this.encodeSmartContractParams(to, amount);
    return this.hexToUnit8(functionName + functionParams);
  }

  private encodeSmartContractParams(to: string, amount: string): string {
    let toAddress = this.base58toHex(to);
    if (!toAddress.startsWith(Tron.ADDRESS_PREFIX)) { // first T is always a T
      throw Error('invalid address');
    }
    // we intentionally drop first T from address since the protocol works this way
    // address hex should be 40 length
    toAddress = toAddress.substring(2);

    let functionParams = AbiCoder.defaultAbiCoder().encode(['address', 'uint256'], [toAddress, amount]);
    if (!functionParams.startsWith('0x')) { // abi always returns prefix hex 0x
      throw Error('Invalid Abi encoded result');
    }
    // we need to remove it so result is only hex
    return functionParams.substring(2);
  }

  private hexToUnit8(hexString: string): Uint8Array {
    return Uint8Array.from(this.hexToByteArray(hexString));
  }

  private hexToByteArray(hexString: string): number[] {
    let pairs = hexString.match(/.{1,2}/g)!; // break down to pairs of 2
    return pairs.map((byte) => parseInt(byte, 16));
  }
}


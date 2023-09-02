import {
  IAddressDto,
  ITronGetAccountResourcesResponse,
  ITronGetBlockResponse,
  IUnspentTransaction,
} from '@kitzen/data-transfer-objects';

export interface BIP39API {
  mnemonicToSeed(mnemonic: string): Buffer;
  generateMnemonic(): Promise<string>;
}

export interface Address {
  address: string;
  derivePath: string;
}

export interface WalletPrivateData {
  seed: Buffer;
  privateKeyBase58: string;
  privateKeyHex: string;
  addressReceive: Address[];
  addressChange: Address[];
}


export interface CreateTransactionInput {
  utxo: IUnspentTransaction[];
  amount: bigint;
  to: string;
  changeAddress: string;
  pricePerByte: number;
  spendOwnFee: boolean;
  fee: bigint;
  allAddresses: IAddressDto[];
  privateKeyBase58: string;
}


export interface CreateTrxTransactionParams {
  // Proto format uses int,
  // js max safe integer is 9007199254740992 trx satoshi, which is more than 500M $ if 13'000'000 trx = 1$
  // this should be sufficient to mark Js Number to cover all transactions costs
  amount: number;
  to: string;
  from: string;
  blockInfo: ITronGetBlockResponse;
}


export interface EstimateTransactionFeeProps {
  accountResources: ITronGetAccountResourcesResponse;
  from: string;
  to: string;
  amount: number;
  privateKeyHex: string;
}


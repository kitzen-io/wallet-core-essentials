import {
  BlockchainNetworkEnum,
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


export interface CreateTrc10TransactionParams {
  amount: string;
  to: string;
  from: string;
  blockInfo: ITronGetBlockResponse;
  feeLimit: number;
}

export interface CreateTrc20TransactionParams extends CreateTrc10TransactionParams {
  contractAddress: string;
}

export interface CreateTrxTransactionParams extends CreateTrc10TransactionParams {
  contractAddress?: string;
  network: BlockchainNetworkEnum;
}


export interface EstimateTransactionFeeProps {
  accountResources: ITronGetAccountResourcesResponse;
  from: string;
  to: string;
  amount: string;
  privateKeyHex: string;
}


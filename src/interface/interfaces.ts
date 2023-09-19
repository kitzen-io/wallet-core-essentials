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

export interface GetTriggerConstantContractParams {
  ownerAddress: string;
  contractAddress: string;
  to: string;
  amount: string;
}

export interface DecodeContractDataResult {
  fromAddress: string;
  toAddress: string;
  amount: bigint;
}

export interface DecodeContractDataParam {
  amount: number;
  owner_address: string;
  to_address: string;
  data?: string;
}

export interface GetTriggerConstantContractResponse {
  owner_address: string;
  contract_address: string;
  function_selector: string;
  parameter: string;
  visible: boolean;
}

export interface EstimateTransactionFeeProps {
  accountResources: ITronGetAccountResourcesResponse;
  network: BlockchainNetworkEnum;
  contractAddress?: string;
  bandwidthPrice: number;
  energyPrice: number;
  energyNeeded: number;
  from: string;
  feeLimit: number;
  to: string;
  amount: string;
}


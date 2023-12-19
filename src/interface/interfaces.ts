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
  validateMnemonic(mnemonic: string, wordlist?: string[]): boolean;
  wordlists: { [index: string]: string[] }
}

export interface Address {
  address: string;
  derivePath: string;
}

export interface WalletPrivateData {
  privateKeyBase58: string;
  privateKeyTronHex: string;
  privateKeyEthBase58: string;
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
  contractAddress?: string;
}

export interface CreateTrc20TransactionParams extends CreateTrc10TransactionParams {
  contractAddress: string;
}

export interface CreateTrxTransactionParams extends CreateTrc10TransactionParams {
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
  amount?: number;
  owner_address: string;
  to_address?: string;
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

export type EthContractParams = {
  address: string;
  method?: string;
  props?: any[];
  abi?: any;
}


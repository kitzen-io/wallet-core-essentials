import {
  IAddressDto,
  IUnspentTransaction
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
}

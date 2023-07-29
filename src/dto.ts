export interface AddressDto {
  address: string,
  network: 'btc' | 'trx',
  type: 'change' | 'receive',
  path: string,
}

export interface GetAuthVerifyDto {
  message: string;
  address: string;
  path: string;
  signature: string;
}

export interface PostAddressDto {
  addresses: AddressDto[];
}

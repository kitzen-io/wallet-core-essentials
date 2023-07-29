import {
  WalletPrivateData
} from "./interfaces";
import {CryptoFactory} from "./crypto-factory";
import {
  AddressDto,
  GetAuthVerifyDto,
  PostAddressDto
} from "./dto";

export function getPostAddressDto(data: WalletPrivateData): PostAddressDto {
  const btxReceiveAddresss: AddressDto[] = data.addressReceive.map((adr) => ({
    address: adr.address,
    network: 'btc',
    type: 'receive',
    path: adr.derivePath,
  }));

  const btcChangeAddress: AddressDto[] = data.addressChange.map((adr) => ({
    address: adr.address,
    network: 'btc',
    type: 'change',
    path: adr.derivePath,
  }));

  const trxReceiveAddress: AddressDto[] = CryptoFactory.getTrx().getAddressFromPrivateKey(data.privateKeyHex).map((adr) => ({
    address: adr.address,
    network: 'trx',
    type: 'receive',
    path: adr.derivePath,
  }))
  return {
    addresses: [
      ...btxReceiveAddresss,
      ...btcChangeAddress,
      ...trxReceiveAddress,
    ],
  }
}

export function getVerifyMessageDto(data: WalletPrivateData, message: string): GetAuthVerifyDto {
  const masterAddress = data.addressReceive[0];
  return {
    message,
    address: masterAddress.address,
    path: masterAddress.derivePath,
    signature: CryptoFactory.getBtc().signMessage(message, masterAddress.derivePath, data.privateKeyBase58),
  };
}



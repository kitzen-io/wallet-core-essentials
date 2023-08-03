import {WalletPrivateData} from "./interfaces";
import {CryptoFactory} from "./crypto-factory";
import {
  IAddressDto,
  PostUserAddressRequest,
  PostUserAuthVerifyRequest,
  AddressNetworkDto,
  AddressTypeDto
} from "@kitzen/api-dto";


export function getPostAddressDto(data: WalletPrivateData, message: string): PostUserAddressRequest {
  let trx = CryptoFactory.getTrx();
  let btc = CryptoFactory.getBtc();
  let allAddresses: Omit<IAddressDto, 'message' | 'signature'> [] = [];
  allAddresses.push(...data.addressReceive.map((adr) => ({
    address: adr.address,
    network: AddressNetworkDto.BTC,
    type: AddressTypeDto.RECEIVE,
    path: adr.derivePath,
  })))

  allAddresses.push(...data.addressReceive.map((adr) => ({
    address: adr.address,
    network: AddressNetworkDto.BTC,
    type: AddressTypeDto.CHANGE,
    path: adr.derivePath,
  })))

  let newVar: PostUserAddressRequest = {
    addresses: allAddresses.map(a => ({
      ...a,
      signature: btc.signMessage(message, a.path, data.privateKeyBase58),
      message,
    }))
  };

  let addressFromPrivateKey = trx.getAddressFromPrivateKey(data.privateKeyHex);

  newVar.addresses.push(...addressFromPrivateKey.map((adr) => ({
    address: adr.address,
    network: AddressNetworkDto.TRX,
    type: AddressTypeDto.RECEIVE,
    path: adr.derivePath,
    message,
    signature: trx.signMessage(message, data.privateKeyBase58)
  })))

  return newVar;
}

export function getVerifyMessageDto(data: WalletPrivateData, message: string): PostUserAuthVerifyRequest {
  const masterAddress = data.addressReceive[0];
  return {
    message,
    address: masterAddress.address,
    path: masterAddress.derivePath,
    signature: CryptoFactory.getBtc().signMessage(message, masterAddress.derivePath, data.privateKeyBase58),
  };
}



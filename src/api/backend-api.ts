import { WalletPrivateData } from '../interface/interfaces';
import { CryptoFactory } from '../bitcoin/crypto-factory';
import {
  AddressTypeEnum,
  BlockchainNetworkEnum,
  IAddressDto,
  IUserAddressRequest,
  IUserAuthVerifyMessageRequest,
} from '@kitzen/data-transfer-objects';

export function getPostAddressDto(data: WalletPrivateData, message: string): IUserAddressRequest {
  const trx = CryptoFactory.getTrx();
  const btc = CryptoFactory.getBtc();

  const allAddresses: Omit<IAddressDto, 'message' | 'signature'> [] = [];
  allAddresses.push(...data.addressReceive.map((adr) => ({
    address: adr.address,
    network: BlockchainNetworkEnum.BTC,
    type: AddressTypeEnum.RECEIVE,
    path: adr.derivePath,
  })));

  allAddresses.push(...data.addressChange.map((adr) => ({
    address: adr.address,
    network: BlockchainNetworkEnum.BTC,
    type: AddressTypeEnum.CHANGE,
    path: adr.derivePath,
  })));

  const result: IUserAddressRequest = {
    addresses: allAddresses.map(a => ({
      ...a,
      signature: btc.signMessage(message, a.path, data.privateKeyBase58),
      message,
    })),
  };

  let addressFromPrivateKey = trx.getAddressFromPrivateKey(data.privateKeyHex);

  result.addresses.push(...addressFromPrivateKey.map((adr) => ({
    address: adr.address,
    network: BlockchainNetworkEnum.TRC10,
    type: AddressTypeEnum.RECEIVE,
    path: adr.derivePath,
    message,
    signature: trx.signMessage(message, data.privateKeyBase58)
  })));

  return result;
}

export function getVerifyMessageDto(data: WalletPrivateData, message: string): IUserAuthVerifyMessageRequest {
  const masterAddress = data.addressReceive[0];
  return {
    message,
    address: masterAddress.address,
    path: masterAddress.derivePath,
    signature: CryptoFactory.getBtc().signMessage(message, masterAddress.derivePath, data.privateKeyBase58),
  };
}



import { WalletPrivateData } from '../interface/interfaces';
import { CryptoFactory } from '../bitcoin/crypto-factory';
import {
  AddressTypeEnum,
  BlockchainNetworkEnum,
  IAddressDto,
  IUserAddressRequest,
  IUserAuthVerifyMessageRequest,
} from '@kitzen/data-transfer-objects';

export async function getPostAddressDto(data: WalletPrivateData, message: string): Promise<IUserAddressRequest> {
  const trx = CryptoFactory.getTrx();
  const btc = CryptoFactory.getBtc();
  const eth = CryptoFactory.getEth()

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

  const tronAddress = trx.getAddressFromPrivateKey(data.privateKeyTronHex);
  const ethAddress = eth.getEthAddressFromPrivateKey(data.privateKeyEthBase58);

  const trxSignature = trx.signMessage(message, data.privateKeyTronHex)
  const ethSignature = await eth.signMessage(message, data.privateKeyEthBase58)

  const otherNetworksAddresses: IAddressDto[] = [...tronAddress.map((adr) => ({
    address: adr.address,
    network: BlockchainNetworkEnum.TRC10,
    type: AddressTypeEnum.RECEIVE,
    path: adr.derivePath,
    message,
    signature: trxSignature,
  })), ...ethAddress.map((adr) => ({
    address: adr.address,
    network: BlockchainNetworkEnum.ETH,
    type: AddressTypeEnum.RECEIVE,
    path: adr.derivePath,
    message,
    signature: ethSignature,
  }))]

  result.addresses.push(...otherNetworksAddresses);

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



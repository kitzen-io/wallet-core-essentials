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
  const eth = CryptoFactory.getEth();

  const result: IUserAddressRequest = {
    addresses: [],
    pubkey: data.publicKeyBase58,
  };

  const tronAddress = trx.getAddressFromPrivateKey(data.privateKeyTronHex);
  const ethAddress = eth.getAddressFromPrivateKey(data.privateKeyEthBase58);

  const trxSignature = trx.signMessage(message, data.privateKeyTronHex)
  const ethSignature = await eth.signMessage(message, data.privateKeyEthBase58)

  const networkAddresses: IAddressDto[] = [...tronAddress.map((adr) => ({
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

  result.addresses.push(...networkAddresses);

  return result;
}

export function getVerifyMessageDto(data: WalletPrivateData, message: string): IUserAuthVerifyMessageRequest {
  const btc = CryptoFactory.getBtc();

  const masterAddress = btc.getBTCAddress(data.publicKeyBase58);
  const btcMasterDerivePath = "m/84'/0'/0'/0/0"

  return {
    message,
    address: masterAddress,
    path: btcMasterDerivePath,
    signature: CryptoFactory.getBtc().signMessage(message, btcMasterDerivePath, data.privateKeyBase58),
  };
}



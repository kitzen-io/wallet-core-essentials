import { CryptoFactory } from "../src";
import {
  mnemonicToSeedSync,
  generateMnemonic,
    validateMnemonic
} from "bip39";
import walletPrivateData from './fixtures/wallet-private-data.json'
import signTransactionInput from './fixtures/sign-transaction-input.json'
import { privateKeyBase58 } from './fixtures/consts';

describe('btc', () => {
  beforeAll(() => {
    CryptoFactory.setBip39({
      mnemonicToSeed: mnemonicToSeedSync,
      generateMnemonic: async(...args) => generateMnemonic(...args),
      validateMnemonic,
      wordlists: {
        'EN': ['word', 'let', 'give']
      }
    });
  });

  test('calculateTransactionVirtualSize', () => {
    let btc = CryptoFactory.getBtc();
    let input: any = {...signTransactionInput, amount: BigInt(signTransactionInput.amount)}
    let virtualSize = btc.calculateTransactionVirtualSize(input);
    expect(virtualSize).toEqual(141)
  });

  test('createTransaction', () => {
    let btc = CryptoFactory.getBtc();
    let input: any = {...signTransactionInput, amount: BigInt(signTransactionInput.amount), fee: BigInt(123)}
    let transaction = btc.createTransaction(input);
    expect(transaction.toHex()).toEqual("02000000000101d670401da3c6bbb8aabb06759bc953f57af09a7ddb5ad8df8ddcb000d7166bef0100000000ffffffff02c800000000000000160014ec3aa85bf15b1e1507e521e4438dc16c9e036110d200010000000000160014a39d1c1fef0403435bdd4ee7a0f097416afdabed02473044022061c295e747a4b412901a004511b82fb7f54e2436fad59415d9ca6fd2b8d78078022013c8a545da42b28d0d4ef6aee74fb15dd0bddf2220f2ad67a85e48bff30545aa012102a19c37fbb8d4d3928c3a7a984e35722c049c30584e8a76c67553ffe05e1f965300000000")
  });

  test('signMessage', () => {
    let btc = CryptoFactory.getBtc();
    let result = btc.signMessage('cd119e94-e2f2-4914-abd1-1cd004410b1a', "m/84'/0'/0'/0/0", privateKeyBase58)
    expect(result).toEqual('KIfdJckxYYq1TeW3Vk4DP79Q8+aOrHz1HQStrbktRiaRSLUocaUrGjGM3Hl+qm9wCr+TYEAigOMO3NfIqECjTyM=');
  });

  test('getWalletPrivateData with mnemonic', () => {
    let btc = CryptoFactory.getBtc();
    let result = btc.getWalletPrivateData('horn always soldier snake basic must mosquito entry tuition protect sustain mango')
    expect(result).toStrictEqual(walletPrivateData);
  });

  test('getWalletPrivateData with private key', () => {
    let btc = CryptoFactory.getBtc();
    let result = btc.getWalletPrivateData(privateKeyBase58)
    expect(result).toStrictEqual(walletPrivateData);
  });

  test('validatePrivateKey', () => {
    let btc = CryptoFactory.getBtc();
    let result = btc.validatePrvPubKey('xpub6E2H3fptTWST9ayPAmAfZUwPtsNFq99f6Ls5xJ5EVoNmLkvAEDPdomwkV2eSsaazwzfbkonWyASwRsHpte1oYCXGzzNZymToqQrsKR3Qdpv')
    expect(result).toBe(true);
  });
});


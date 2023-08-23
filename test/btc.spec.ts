import { CryptoFactory } from "../src";
import {
  mnemonicToSeedSync,
  generateMnemonic
} from "bip39";
import walletPrivateData from './fixtures/wallet-private-data.json'
import signTransactionInput from './fixtures/sign-transaction-input.json'

describe('btc', () => {
  beforeAll(() => {
    CryptoFactory.setBip39({
      mnemonicToSeed: mnemonicToSeedSync,
      generateMnemonic: async(...args) => generateMnemonic(...args),
    });
    // @ts-ignore
    walletPrivateData.seed = new Buffer(walletPrivateData.seed.data);
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
    // private key is this json is random and doesn't have any money
    let transaction = btc.createTransaction(input);
    expect(transaction.toHex()).toEqual("02000000000101d670401da3c6bbb8aabb06759bc953f57af09a7ddb5ad8df8ddcb000d7166bef0100000000ffffffff02c800000000000000160014ec3aa85bf15b1e1507e521e4438dc16c9e036110d200010000000000160014a39d1c1fef0403435bdd4ee7a0f097416afdabed02473044022061c295e747a4b412901a004511b82fb7f54e2436fad59415d9ca6fd2b8d78078022013c8a545da42b28d0d4ef6aee74fb15dd0bddf2220f2ad67a85e48bff30545aa012102a19c37fbb8d4d3928c3a7a984e35722c049c30584e8a76c67553ffe05e1f965300000000")
  });

  test('signMessage', () => {
    let btc = CryptoFactory.getBtc();
    // don't be too happy :)
    // this is non-existing wallet private key and id
    let result = btc.signMessage('cd119e94-e2f2-4914-abd1-1cd004410b1a', "m/84'/0'/0'/0/0", 'xprv9s21ZrQH143K4S5hK2gdwvJbP5GQsKGgRZnUda3RMP7C33Xde4QaQtP9oNCEh1aKzFHGLNRMjCnqbSNj9Xxo8YDHaZC2LSQwj5RpmLNbi7i')
    expect(result).toEqual('J+js9BiC8UUEOvh0g9poxq5Q97CvWzfVTmBEdM05KWlgASoVvVki0bwBQeFOW5JDeXPW8Ng0sb/joeIy6nGfs/M=');
  });

  test('getWalletPrivateData', () => {
    let btc = CryptoFactory.getBtc();
    // don't be too happy :)
    // this is non-existing wallet private key and id
    let result = btc.getWalletPrivateData('horn always soldier snake basic must mosquito entry tuition protect sustain mango')
    expect(result).toStrictEqual(walletPrivateData);
  });

});


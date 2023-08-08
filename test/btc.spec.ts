import { CryptoFactory } from "../src";
import {
  mnemonicToSeedSync,
  generateMnemonic
} from "bip39";
import walletPrivateData from './fixtures/wallet-private-data.json'
describe('btc', () => {
  beforeAll(() => {
    CryptoFactory.setBip39({
      mnemonicToSeed: mnemonicToSeedSync,
      generateMnemonic: async(...args) => generateMnemonic(...args),
    });
    // @ts-ignore
    walletPrivateData.seed = new Buffer(walletPrivateData.seed.data);
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


import { Tron } from '../src/tron/trx';

describe('trx', () => {
  test('signMessage', () => {
    let trx = new Tron();
    // don't be too happy :)
    // this is non-existing wallet private key and id
    let result = trx.signMessage('cd119e94-e2f2-4914-abd1-1cd004410b1a', '1d742c9a796aba395b9482717c5e539dc3c64becf9f3a8795277f16209a150af');
    expect(result).toEqual('0x34cbd1095e828e128ffc69d2aeeec3cfbfc15c40aa150607c69694ddcf4080560f89599347bc53d5d6712fc855273e4703d6a1828234b606b5eaed44c4012db81b');
  });
  test('getAddressFromPrivateKey', () => {
    let trx = new Tron();
    // don't be too happy :)
    // this is non-existing wallet private key and id
    let result = trx.getAddressFromPrivateKey('1d742c9a796aba395b9482717c5e539dc3c64becf9f3a8795277f16209a150af');
    expect(result).toStrictEqual([{ address: 'TDRb4GFiWU3dG5uxcx5kveszvcMagB8Vuu', derivePath: "m/84'/0'/0'/0/0" }]);
  });
});


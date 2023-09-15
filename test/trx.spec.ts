import { Tron } from '../src/tron/trx';
import * as blockInfo from './fixtures/blokc-info-response.json';
import {
  createTrc20Res,
  createTrxTransactionRes,
  privateKeyHex
} from './fixtures/consts';


describe('trx', () => {

  test('signMessage', () => {
    let trx = new Tron();
    let result = trx.signMessage('cd119e94-e2f2-4914-abd1-1cd004410b1a', privateKeyHex);
    expect(result).toEqual('0x34cbd1095e828e128ffc69d2aeeec3cfbfc15c40aa150607c69694ddcf4080560f89599347bc53d5d6712fc855273e4703d6a1828234b606b5eaed44c4012db81b');
  });

  test('getAddressFromPrivateKey', () => {
    let trx = new Tron();
    // don't be too happy :)
    // this is non-existing wallet private key and id
    let result = trx.getAddressFromPrivateKey('1d742c9a796aba395b9482717c5e539dc3c64becf9f3a8795277f16209a150af');
    expect(result).toStrictEqual([{ address: 'TDRb4GFiWU3dG5uxcx5kveszvcMagB8Vuu', derivePath: "m/84'/0'/0'/0/0" }]);
  });

  test('createTrxTransaction', () => {
    let trx = new Tron();
    // don't be too happy :)
    // this is non-existing wallet private key and id
    let result = trx.createTrxTransaction({
      from: "TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht",
      to: "TNWaTu5aATAUP9vhBPeWFMLEFjesCQ6j4u",
      amount: "1119916",
      blockInfo,
    });
    let res2 = trx.signTransaction(result, privateKeyHex)
    expect(res2).toStrictEqual(createTrxTransactionRes);
  });

  test('validateAddress', () => {
    let trx = new Tron();
    // don't be too happy :)
    // this is non-existing wallet private key and id
    expect(trx.validateAddress('TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht')).toEqual(true)
    expect(trx.validateAddress('TM94JwXLN33Gw4L8KF1eBPaEEPcdQ06hht')).toEqual(false);
  });

  test('base58toHex', () => {
    let trx = new Tron();
    // owner address
    expect(trx.base58toHex('TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht')).toEqual('417A8649ABFA3D24F8D0DC70D2B6D50E4F8A6F7613');
  });

  test('base58toHex should transform usdt contract address correctly according to protobuf', () => {
    let trx = new Tron();
    // contract address
    expect(trx.base58toHex('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t')).toEqual('41A614F803B6FD780986A42C78EC9C7F77E6DED13C');
  });

  test('base58toHex receiver address', () => {
    let trx = new Tron();
    // contract address
    expect(trx.base58toHex('TCXFzBg8XjZF2NUjDSzSxXLBxeZxgPpS5o')).toEqual('411C000DD56B9E634FE67346B89045990CB7BB821D');
  });

  test('createSmartContract', () => {
    let trx = new Tron();
    // don't be too happy :)
    // this is non-existing wallet private key and id

    let result = trx.createTrc20Transaction({
      "to": "TCXFzBg8XjZF2NUjDSzSxXLBxeZxgPpS5o",
      "amount": "1000000",
      "from": "TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht",
      contractAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", // https://tronscan.io/#/token20/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
      blockInfo,
    });
     let res2 = trx.signTransaction(result, privateKeyHex)
    expect(res2).toStrictEqual(createTrc20Res);
  });

  test('estimateTransactionFee', () => {
    let trx = new Tron();
    // don't be too happy :)
    // this is non-existing wallet private key and id
    expect(trx.estimateTransactionFee({
      "to": "TNWaTu5aATAUP9vhBPeWFMLEFjesCQ6j4u",
      "amount": "130107",
      "from": "TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht",
      "privateKeyHex": privateKeyHex,
      "accountResources": {
        "freeNetLimit": 600,
        "assetNetUsed": [
          {
            "key": "1004950",
            "value": 0
          }
        ],
        "assetNetLimit": [
          {
            "key": "1004950",
            "value": 0
          }
        ],
        "TotalNetLimit": 43200000000,
        "TotalNetWeight": 41417889010,
        "TotalEnergyLimit": 90000000000,
        "TotalEnergyWeight": 5324333827
      }
    })).toEqual(0)
  });
});

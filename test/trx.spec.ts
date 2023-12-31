import { Tron } from '../src/tron/trx';
import * as blockInfo from './fixtures/blokc-info-response.json';
import {
  createTrc20Res,
  createTrxTransactionRes,
  privateKeyHex
} from './fixtures/consts';
import { BlockchainNetworkEnum } from '@kitzen/data-transfer-objects';


describe('trx', () => {

  test('signMessage', () => {
    let trx = new Tron();
    let result = trx.signMessage('cd119e94-e2f2-4914-abd1-1cd004410b1a', privateKeyHex);
    expect(result).toEqual('0x34cbd1095e828e128ffc69d2aeeec3cfbfc15c40aa150607c69694ddcf4080560f89599347bc53d5d6712fc855273e4703d6a1828234b606b5eaed44c4012db81b');
  });

  test('getAddressFromPrivateKey', () => {
    let trx = new Tron();
    let result = trx.getAddressFromPrivateKey(privateKeyHex);
    expect(result).toStrictEqual([{ address: 'TDRb4GFiWU3dG5uxcx5kveszvcMagB8Vuu', derivePath: "m/84'/0'/0'/0/0" }]);
  });

  test('createTrxTransaction', () => {
    let trx = new Tron();
    let result = trx.createTrc10Transaction({
      from: "TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht",
      to: "TNWaTu5aATAUP9vhBPeWFMLEFjesCQ6j4u",
      amount: "1119916",
      blockInfo,
      feeLimit: 10_000_000,
    });
    let res2 = trx.signTransaction(result, privateKeyHex)
    expect(res2).toStrictEqual(createTrxTransactionRes);
  });

  test('validateAddress', () => {
    let trx = new Tron();
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

  test('hexToBase58 receiver address', () => {
    let trx = new Tron();
    // contract address
    expect(trx.hexToBase58('411C000DD56B9E634FE67346B89045990CB7BB821D')).toEqual('TCXFzBg8XjZF2NUjDSzSxXLBxeZxgPpS5o');
  });

  test('decode smart contract param', () => {
    let trx = new Tron();
    // contract address
    expect(trx.decodeContractData({
      amount: 1000000,
      to_address: '411C000DD56B9E634FE67346B89045990CB7BB821D',
      owner_address: '417A8649ABFA3D24F8D0DC70D2B6D50E4F8A6F7613',
      data: 'a9059cbb0000000000000000000000001c000dd56b9e634fe67346b89045990cb7bb821d00000000000000000000000000000000000000000000000000000000000f4240'
    })).toEqual({"amount": BigInt(1000000), "fromAddress": "TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht", "toAddress": "TCXFzBg8XjZF2NUjDSzSxXLBxeZxgPpS5o"});
  });

  test('createSmartContract', () => {
    let trx = new Tron();
    let result = trx.createTrc20Transaction({
      "to": "TCXFzBg8XjZF2NUjDSzSxXLBxeZxgPpS5o",
      "amount": "1000000",
      "from": "TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht",
      contractAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", // https://tronscan.io/#/token20/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
      blockInfo,
      feeLimit: 10_000_000,
    });
    let res2 = trx.signTransaction(result, privateKeyHex)
    expect(res2).toStrictEqual(createTrc20Res);
  });

  test('estimateTransactionFee', () => {
    let trx = new Tron();
    expect(trx.estimateTransactionFee({
      "to": "TNWaTu5aATAUP9vhBPeWFMLEFjesCQ6j4u",
      "amount": "130107",
      "from": "TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht",
      network: BlockchainNetworkEnum.TRC10,
      feeLimit: 100_000_000,
      bandwidthPrice: 0,
      energyNeeded: 0,
      energyPrice: 0,
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
        EnergyUsed: 0,
        EnergyLimit: 0,
        NetUsed: 0,
        NetLimit: 0,
        freeNetUsed: 0,
        "TotalNetLimit": 43200000000,
        "TotalNetWeight": 41417889010,
        "TotalEnergyLimit": 90000000000,
        "TotalEnergyWeight": 5324333827
      }
    })).toEqual(0)
  });
});

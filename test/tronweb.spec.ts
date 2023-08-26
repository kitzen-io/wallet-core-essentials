import {
  byteArray2hexStr,
  decodeBase58Address
} from '../src/tron/tronweb';

describe('tronweb', () => {

  test('byteArray2hexStr', () => {
    expect(byteArray2hexStr(decodeBase58Address('TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht'))).toEqual('417A8649ABFA3D24F8D0DC70D2B6D50E4F8A6F7613');
  });

});


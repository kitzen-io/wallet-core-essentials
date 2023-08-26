import { PrintTool } from "../src";
import * as assetMetadata from "@kitzen/assets/lib/assets.metadata.constant.json"
import {BlockchainNetworkEnum} from '@kitzen/data-transfer-objects';
describe('print.tool', () => {

  test('convertBigNumber', () => {
    let printTool = new PrintTool(assetMetadata);
    let numberStr = "1100000000.00000002";
    let out = printTool.stringCryptoToBigIngSatoshi({
      balance: numberStr,
      network: BlockchainNetworkEnum.BTC,
      identifier: 'coin'
    })
    expect(out).toEqual(BigInt("110000000000000002"))
  });

  test('convertBigNumber2', () => {
    let printTool = new PrintTool(assetMetadata);
    let numberStr = "1100000000.0000002";
    let out = printTool.stringCryptoToBigIngSatoshi({
      balance: numberStr,
      network: BlockchainNetworkEnum.BTC,
      identifier: 'coin'
    })
    expect(out).toEqual(BigInt("110000000000000020"))
  });

});


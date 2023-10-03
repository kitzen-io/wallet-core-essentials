import { PrintTool } from "../src";
import {
  getAssetMetadata,
  getAssetMetadataObject
} from "@kitzen/assets";
import { BlockchainNetworkEnum } from '@kitzen/data-transfer-objects';


describe('print.tool', () => {

  let printTool: PrintTool;
  beforeEach(() => {
    printTool = new PrintTool(getAssetMetadataObject('production'));
  });

  test('convertBigNumber', () => {
    let numberStr = "1100000000.00000002";
    let out = printTool.stringCryptoToBigIngSatoshi({
      balance: numberStr,
      network: BlockchainNetworkEnum.BTC,
      identifier: 'coin'
    })
    expect(out).toEqual(BigInt("110000000000000002"))
  });

  test('convertBigNumber2', () => {
    let numberStr = "1100000000.0000002";
    let out = printTool.stringCryptoToBigIngSatoshi({
      balance: numberStr,
      network: BlockchainNetworkEnum.BTC,
      identifier: 'coin'
    })
    expect(out).toEqual(BigInt("110000000000000020"))
  });


  describe('printFiat', () => {
    it('should format a number as USD currency', () => {
      const formattedValue = printTool.printFiatNative(1000);
      expect(formattedValue).toBe('$1,000.00');
    });

    it('should handle undefined or zero gracefully', () => {
      expect(printTool.printFiatNative()).toBe('$0.00');
      expect(printTool.printFiatNative(0)).toBe('$0.00');
    });
  });

  describe('printRate', () => {
    it('should print the rate as USD currency', () => {
      const formattedRate = printTool.printRate('10.5');
      expect(formattedRate).toBe('$10.50');
    });

    it('should handle undefined or zero gracefully', () => {
      expect(printTool.printRate()).toBe('$0.00');
      expect(printTool.printRate('0')).toBe('$0.00');
    });
  });

  describe('printTransactionId', () => {
    it('should truncate long transaction IDs', () => {
      const txId = '1234567890abcdef1234567890abcdef1234567890abcdef';
      const truncatedTxId = printTool.printTransactionId(txId);
      expect(truncatedTxId).toBe('123456..67890abcdef');
    });

    it('should return the same ID for short transaction IDs', () => {
      const txId = '123456';
      const unchangedTxId = printTool.printTransactionId(txId);
      expect(unchangedTxId).toBe(txId);
    });
  });

  describe('printCrypto', () => {
    it('should print crypto value with symbol', () => {
      const cryptoStr = printTool.printCrypto(123.45678901, BlockchainNetworkEnum.BTC, 'coin');
      expect(cryptoStr).toBe('123.45678901 BTC');
    });

    it('should handle undefined input', () => {
      expect(printTool.printCrypto(0.0000002, BlockchainNetworkEnum.BTC, 'coin')).toBe('0.00000020 BTC');
    });
  });

  describe('printCoinName', () => {
    it('should print the coin name', () => {
      const coinName = printTool.printCoinName(BlockchainNetworkEnum.BTC, 'coin');
      expect(coinName).toBe('BTC');
    });

    it('should handle undefined input', () => {
      expect(printTool.printCoinName(BlockchainNetworkEnum.TRC10, 'unknown')).toBe('?');
    });
  });

  describe('getDecimals', () => {
    it('should return the decimals for a given network and identifier', () => {
      const decimals = printTool.getDecimals(BlockchainNetworkEnum.BTC, 'coin');
      expect(decimals).toBe(8);
    });

    it('should return 1 for undefined input', () => {
      const decimals = printTool.getDecimals(BlockchainNetworkEnum.BTC, 'unknown');
      expect(decimals).toBe(1);
    });
  });

  describe('parseStringFloatCrypto', () => {
    it('should print crypto value from a string', () => {
      const cryptoStr = printTool.parseStringFloatCrypto('1234567890123.45678901', BlockchainNetworkEnum.BTC, 'coin');
      expect(cryptoStr).toBe('1234567890123.45678711 BTC');
    });
  });

  describe('printFiatAsset', () => {
    it('should print the fiat value of an asset', () => {
      const asset = {
        network: BlockchainNetworkEnum.BTC,
        identifier: 'coin',
        rate: '1000',
        balance: '12345678901',
      };
      const fiatValue = printTool.printFiatAsset(asset);
      expect(fiatValue).toBe('$123,456.79');
    });

    it('should handle undefined input', () => {
      expect(printTool.printFiatAsset()).toBe('$0.00');
    });
  });

  describe('printCryptoAsset', () => {
    it('should print crypto value for an asset', () => {
      const asset = {
        network: BlockchainNetworkEnum.BTC,
        identifier: 'coin',
        balance: '12345678901',
      };
      const cryptoStr = printTool.printCryptoAsset(asset);
      expect(cryptoStr).toBe('123.45678901 BTC');
    });

    it('should handle undefined input', () => {
      expect(printTool.printCryptoAsset()).toBe('?');
    });
  });

  describe('getAssetInFiat', () => {
    it('should calculate the asset value in fiat', () => {
      const asset = {
        network: BlockchainNetworkEnum.BTC,
        identifier: 'coin',
        rate: '0.0000000000012',
        balance: '1234567890123423423129423',
      };
      const assetValueInFiat = printTool.getAssetInFiat(asset);
      expect(assetValueInFiat).toBe(14814.82);
    });

    it('should handle undefined input', () => {
      expect(printTool.getAssetInFiat()).toBe(0);
    });
  });

  describe('printDate', () => {
    it('should format a date as a short date and time in en-GB locale', () => {
      const dateStr = '2023-09-03T12:34:56Z';
      const formattedDate = printTool.printDate(dateStr);
      expect(formattedDate).toBe('03/09/2023, 12:34');
    });
  });

});


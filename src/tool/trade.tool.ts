import { CalculationTool } from './index';
import { CoinsEnum, ConversionEnum } from '@kitzen/data-transfer-objects';

class TradeTool {
  public static getTradeFee(escrowTransactionFeeRate: number, escrowTransactionMinSatoshiAmount: number, cryptoAmount: bigint): bigint {
    const fee: bigint = CalculationTool.bigIntMulNumber(cryptoAmount, escrowTransactionFeeRate);

    if (fee < BigInt(escrowTransactionMinSatoshiAmount)) {
      return BigInt(escrowTransactionMinSatoshiAmount);
    }

    return fee;
  }


  /**
   * Calculates min offer fiat amount, due platform limitations.
   * @param escrowTransactionFeeRate - platform fee rate (for example, value: 0.005 equals 5%)
   * @param escrowTransactionMinAmount - min amount in coins (for example, value: 2000 means 2000 satoshi)
   * @param pricePerCoin - currency rate. (for example, value: 44000 means that 44k per 1 coin)
   * @param cryptoSymbol - for example: btc (use Coins enum)
   * @param fiatSymbol - for example: usd (use Coins enum)
   *
   * returns min amount in fiat coins (for example, value: 18 means $18)
   */
  public static calculateMinOfferFiatAmount(escrowTransactionFeeRate: number, escrowTransactionMinAmount: number, pricePerCoin: number, cryptoSymbol: CoinsEnum, fiatSymbol: CoinsEnum): number {
    const minCoinEquivalent = escrowTransactionMinAmount * 3;

    const fiatCoins = CalculationTool.toPenny(1, fiatSymbol);
    const cryptoAmountPerUnit = CalculationTool.toCrypto(fiatCoins.toString(), pricePerCoin, ConversionEnum[cryptoSymbol]);

    return Math.round(minCoinEquivalent / Number(cryptoAmountPerUnit));
  }
}

export default TradeTool;

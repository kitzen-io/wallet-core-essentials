import { CalculationTool } from './index';

const FIAT_DECIMALS = 10000;
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
   * @param cryptoDecimals - for example: btc (use Coins enum)
   *
   * returns min amount in fiat coins (for example, value: 18 means $18)
   */
  public static calculateMinOfferFiatAmount(escrowTransactionFeeRate: number, escrowTransactionMinAmount: number, pricePerCoin: number, cryptoDecimals: number): number {
    const minCoinEquivalent = escrowTransactionMinAmount * 3;

    const fiatCoins = CalculationTool.toPenny(1, FIAT_DECIMALS);
    const cryptoAmountPerUnit = CalculationTool.toCrypto(fiatCoins.toString(), pricePerCoin, cryptoDecimals);

    return Math.round(minCoinEquivalent / Number(cryptoAmountPerUnit));
  }
}

export default TradeTool;

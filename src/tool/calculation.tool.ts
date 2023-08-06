import BigNumber from 'bignumber.js';

class CalculationTool {
  /**
   * For example toPenny(1, 'btc') - converts 1 btc to satoshi, returns 100000000
   * @param coinAmount - numeric amount
   * @param decimals - coin decimals
   */
  public static toPenny(coinAmount: number, decimals: number): bigint {
    CalculationTool.setup();
    return BigInt(new BigNumber(coinAmount.toString()).times(new BigNumber(Math.pow(10, decimals))).dp(0).toFixed());
  }

  /**
   * For example toCoin(100000000, 'btc') - converts 1kk satoshi to btc, returns 1
   * @param coins - amount of coins
   * @param decimals - coin decimals
   */
  public static toCoin(coins: bigint, decimals: number): number {
    CalculationTool.setup();
    const decimal = Math.pow(10, decimals);
    return +new BigNumber(coins.toString()).div(new BigNumber(decimal));
  }

  public static bigIntMulNumber(bi: bigint, n: number): bigint {
    CalculationTool.setup();
    return BigInt(new BigNumber(bi.toString()).times(new BigNumber(n)).dp(0).toString());
  }

  public static bigIntDivNumber(bi: bigint, n: number): bigint {
    CalculationTool.setup();
    return BigInt(new BigNumber(bi.toString()).div(new BigNumber(n)).dp(0).toString());
  }

  /**
   * Convert amount to fixed amount. For example: 1.1293129312931 may map to short string
   * toFixed(1.9999, 2) will return 1.99
   * @param amount
   * @param fixedNumber
   */
  public static toFixed(amount: BigNumber | string, fixedNumber: number = 2): string {
    const amountString = amount.toString().replace(',', '.');

    const [intergral, fraction] = amountString.split('.');

    if (!fraction) {
      return intergral;
    }

    const slicedFraction = fraction.slice(0, fixedNumber);
    const additionalZeroLength = fixedNumber - slicedFraction.length;
    const additionalZero = Array(additionalZeroLength).fill(0).join('');

    return `${intergral}.${slicedFraction}${additionalZero}`;
  }

  /**
   * Convert crypto coins to fiat by currency rate
   * @param amountInCoins
   * @param rate
   * @param decimals
   */
  public static toFiat(amountInCoins: string | number, rate: number, decimals: number): string {
    CalculationTool.setup();
    const amount = new BigNumber(amountInCoins.toString())
      .times(rate)
      .div(new BigNumber(Math.pow(10, decimals)));

    return CalculationTool.toFixed(amount);
  }

  /**
   * Convert fiat to crypto by currency rate
   * @param fiatCoins - penny coins. to convert 1 dollar to penny use method" `CalculationTool.toPenny(1, Coins.USD);`
   * @param pricePerCoin - rate, for example 44000 (44k usd per 1 btc)
   * @param fiatDecimals - fiat decimals
   * @param coinDecimals - coin decimals
   * toCrypto(
   */
  public static toCrypto = (fiatCoins: string, pricePerCoin: number, fiatDecimals: number, coinDecimals: number): string => {
    CalculationTool.setup();

    const priceInCoins = new BigNumber(pricePerCoin).times(new BigNumber(Math.pow(10, fiatDecimals)));
    return new BigNumber(fiatCoins)
      .times(Math.pow(10, coinDecimals))
      .div(priceInCoins)
      .dp(0)
      .toFixed();
  };

  public static setup(): void {
    BigNumber.config({ EXPONENTIAL_AT: 1000000000 });
    BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_CEIL });
  }
}

export default CalculationTool;

## CalculationTool

This class provides functions to handle calculations related to numeral formats and conversions for cryptocurrency amounts.

### Properties

- `FIAT_DECIMALS`: The decimal places precision used for fiat calculations.

### Methods

#### `toPenny(coinAmount: number, decimals: number): bigint`

Converts cryptocurrency amount to the smallest unit of the currency (such as Satoshi for Bitcoin).

#### `toCoin(coins: bigint, decimals: number): number`

Converts the smallest unit of cryptocurrency amount to the standard unit (like converting Satoshi to Bitcoin).

#### `bigIntMulNumber(bi: bigint, n: number): bigint`

Multiplies a BigInt value with a number.

#### `bigIntDivNumber(bi: bigint, n: number): bigint`

Divides a BigInt value by a number.

#### `toFixed(amount: BigNumber | string, fixedNumber: number = 2): string`

Converts an amount to a string with a fixed decimal place.

#### `toFiat(amountInCoins: string | number, rate: number, decimals: number): string`

Converts a cryptocurrency amount to fiat using the provided conversion rate and the decimal places count for the cryptocurrency.

#### `multiply(rate: string, balance: string, decimals: number): number`

Multiplies the balance with the conversion rate, adjusts it according to the provided decimal places, and returns the product.

#### `toCrypto(fiatCoins: string, pricePerCoin: number, coinDecimals: number): string`

Converts a fiat amount to cryptocurrency using the provided conversion rate and decimal places count for the cryptocurrency.

#### `setup(): void`

Sets the configuration for the underlying BigNumber calculations.


## PrintTool

This class provides several handy methods for printing amounts, rates, transaction IDs and more, in various formats.

### Constructor

The `PrintTool` class is constructed with four parameters:

- `assetsInfo`, an object that comprises the metadata related to each asset.

- `getLocale`, a function which returns the current locale used by the application.

- `getCurrentCurrencyRate`, a function that returns the current conversion rate.

- `getCurrentCurrencyIdentifier`, a function that returns the current fiat currency identifier.

Properties:

- `balance`, `network`, and `identifier` are properties used in several of the methods in the class.

### Methods

#### `printFiatNative(num?: number): string`

Formats the given number as a fiat currency, based on the current currency locale.

#### `printRate(rate?: string): string`

Formats the given rate as a fiat currency rate.

#### `inputFiatToInputCrypto(props: AssetIdentifierWithRate): string | null`

Converts a balance in fiat to a balance in cryptocurrency based on the given rate.

#### `inputInCryptoToInputFiat(props: AssetIdentifierWithRate): string | null`

Converts a balance in cryptocurrency to a balance in fiat based on the given rate.

#### `printTransactionId(tx: string): string`

Formats the transaction ID in a shorter form.

#### `printCrypto(num: number, network: BlockchainNetworkEnum, identifier: string = 'coin'): string`

Formats a given amount of cryptocurrency with its symbol.

#### `printCoinName(network: BlockchainNetworkEnum, identifier: string): string`

Returns the symbol of a given asset or coin.

#### `getDecimals(network: BlockchainNetworkEnum, identifier: string): number`

Returns the decimal count specific for the given asset or coin.

#### `parseStringFloatCrypto(num: string, network: BlockchainNetworkEnum, identifier = 'coin'): string`

Parses a given numeral string to its cryptocurrency format.

#### `printFiatAsset(asset?: AssetIdentifierWithRate): string`

Returns the value of a given asset converted to fiat, formatted as a currency string.

#### `stringCryptoToBigIngSatoshi(asset?: AssetIdentifier): bigint`

Converts a given cryptocurrency balance string to Satoshi format in `BigInt`.

#### `printCryptoAsset(asset?: AssetIdentifier): string`

Formats a given asset's balance to its cryptocurrency format.

#### `getAssetInFiat(asset?: AssetIdentifierWithRate): number`

Converts a given asset's balance to fiat using the current currency rate.

#### `printDate(date: string): string`

Formats a date string to be more readable.

#### `getAssetInfo<T extends keyof IAssetMetadata>(network: BlockchainNetworkEnum, identifier: string, field: T, defaultValue?: IAssetMetadata[T]): IAssetMetadata[T]`

Returns the requested field from the asset's metadata. If the field does not exist, it will return a default value if provided, otherwise it will throw an error.

## TradeTool

This class provides methods for handling calculations related to trading and fees.

### Methods

#### `getTradeFee(escrowTransactionFeeRate: number, escrowTransactionMinSatoshiAmount: number, cryptoAmount: bigint): bigint`

Calculates and returns the trade fee considering the platform's minimum fee amount. If the calculated fee is less than the minimum acceptable fee, the minimum amount is returned.

Parameters:
- escrowTransactionFeeRate is rate of transaction fee.
- escrowTransactionMinSatoshiAmount is minimum acceptable fee in Satoshi.
- cryptoAmount is the amount of cryptocurrency the fee should be calculated for.

#### `calculateMinOfferFiatAmount(escrowTransactionFeeRate: number, escrowTransactionMinAmount: number, pricePerCoin: number, cryptoDecimals: number): number`

Calculates the minimum acceptable offer amount in fiat currency.

Parameters:
- escrowTransactionFeeRate is rate of transaction fee.
- escrowTransactionMinAmount is minimum acceptable transaction amount in coins.
- pricePerCoin is the conversion rate of the cryptocurrency.
- cryptoDecimals is the number of decimals in the cryptocurrency.

Returns: the minimum acceptable offer in fiat currency.

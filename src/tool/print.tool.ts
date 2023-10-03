import {
  BlockchainNetworkEnum,
  FiatCurrency,
  IAssetBalance,
} from '@kitzen/data-transfer-objects';
import type {
  IAssetMetadata,
  IAssetMetadataObject,
} from '@kitzen/assets';
import CalculationTool from '../tool/calculation.tool';
import BigNumber from 'bignumber.js';

export type AssetIdentifier = Pick<IAssetBalance, 'identifier' | 'balance' | 'network'>;
export type AssetIdentifierWithRate = Pick<IAssetBalance, 'identifier' | 'balance' | 'network' | 'rate'>;


export class PrintTool {
  public constructor(
    private readonly assetsInfo: IAssetMetadataObject,
    private readonly getLocale: () => string,
    private readonly getCurrentCurrencyRate: () => number,
    private readonly getCurrentCurrencyIdentifier: () => FiatCurrency,
  ) {
  }

  public printFiatNative(num?: number): string {
    const options = {
      style: 'currency',
      currency: this.getCurrentCurrencyIdentifier()!.toUpperCase(),
    };
    const locale = this.getLocale();
    const formatter = new Intl.NumberFormat(locale, options);
    return formatter.format(num || 0);
  }

  public printRate(rate?: string): string {
    if (rate === undefined) {
      return '?';
    }
    const normalizedRate = new BigNumber(rate).multipliedBy(this.getCurrentCurrencyRate()).toNumber();
    return this.printFiatNative(normalizedRate);
  }

  public inputFiatToInputCrypto(props: AssetIdentifierWithRate): string | null {
    if (props.balance.trim() == '') {
      return '';
    }
    if (props.balance.match(/^([0-9]{1,})?(\.)?([0-9]{1,2})?$/)) {
      const decimals = this.getDecimals(props.network, props.identifier);
      return BigNumber(props.balance)
        .div(props.rate)
        .div(this.getCurrentCurrencyRate())
        .toFixed(decimals);
    } else {
      return null;
    }
  }

  public inputInCryptoToInputFiat(props: AssetIdentifierWithRate): string | null {
    if (props.balance.trim() == '') {
      return '';
    }
    const decimals = this.getDecimals(props.network, props.identifier);
    const regex = new RegExp(`^([0-9]{1,})?(\\.)?([0-9]{1,${decimals}})?\$`);
    if (props.balance && props.balance.match(regex)) {
      return BigNumber(props.balance)
        .multipliedBy(this.getCurrentCurrencyRate())
        .multipliedBy(props.rate)
        .toFixed(2);
    } else {
      return null;
    }
  }

  public printTransactionId(tx: string): string {
    if (tx?.length > 20) {
      return `${tx.substring(0, 6)}..${tx.substring(tx.length - 11, tx.length)}`;
    }
    return tx;
  }

  public printCrypto(num: number, network: BlockchainNetworkEnum, identifier: string = 'coin'): string {
    if (num == undefined || !network || !identifier) {
      return '?';
    }
    const coinSymbol = this.getAssetInfo(network, identifier, 'symbol');
    let decimals = this.getAssetInfo(network, identifier, 'decimals');
    if (decimals > 8) {
      decimals = 8;
    }
    return `${num.toFixed(decimals)} ${coinSymbol}`;
  }

  public printCoinName(network: BlockchainNetworkEnum, identifier: string): string {
    return this.getAssetInfo(network, identifier, 'symbol', '?');
  }

  public getDecimals(network: BlockchainNetworkEnum, identifier: string): number {
    return this.getAssetInfo(network, identifier, 'decimals', 1);
  }

  public parseStringFloatCrypto(num: string, network: BlockchainNetworkEnum, identifier = 'coin'): string {
    return this.printCrypto(Number(num), network, identifier);
  }

  public printFiatAsset(asset?: AssetIdentifierWithRate): string {
    return this.printFiatNative(this.getAssetInFiat(asset));
  }

  public stringCryptoToBigIngSatoshi(asset?: AssetIdentifier): bigint {
    if (!asset || !asset.balance) {
      return BigInt(0);
    }
    const decimals = this.getAssetInfo(asset.network, asset.identifier, 'decimals');
    let commaIndex = asset.balance.indexOf('.');
    if (commaIndex < 0) {
      return BigInt(asset.balance) * BigInt(Math.pow(10, decimals));
    }
    let beforeComma: string = asset.balance.substring(0, commaIndex);
    let floatPart: string = asset.balance.substring(commaIndex + 1);
    floatPart = floatPart.padEnd(decimals, '0');
    let afterComma = floatPart.substring(0, decimals);

    return BigInt(`${beforeComma}${afterComma}`);
  }


  public printCryptoAsset(asset?: AssetIdentifier): string {
    if (!asset) {
      return '?';
    }

    let decimals = this.getAssetInfo(asset.network, asset.identifier, 'decimals');
    let inCrypto = Number(asset.balance) / Math.pow(10, decimals);
    return this.printCrypto(inCrypto, asset.network, asset.identifier);
  }

  public getAssetInFiat(asset?: AssetIdentifierWithRate): number {
    if (!asset) {
      return 0;
    }
    const decimals = this.getAssetInfo(asset.network, asset.identifier, 'decimals');
    const rate = BigNumber(asset.rate).multipliedBy(this.getCurrentCurrencyRate()).toString();
    return CalculationTool.multiply(rate, asset.balance, decimals);
  }

  public printDate(date: string): string {
    return new Date(date).toLocaleString('en-GB', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

  private getAssetInfo<T extends keyof IAssetMetadata>(
    network: BlockchainNetworkEnum,
    identifier: string,
    field: T,
    defaultValue?: IAssetMetadata[T],
  ): IAssetMetadata[T] {
    const asset: IAssetMetadata = this.assetsInfo[network]?.[identifier];
    if (!asset) {
      if (defaultValue == undefined) {
        throw Error(`Information about asset ${network} ${identifier} not found`);
      } else {
        return defaultValue;
      }
    }
    return asset[field];
  }

}


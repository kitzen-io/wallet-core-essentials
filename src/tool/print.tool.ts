import {
  BlockchainNetworkEnum,
  IAssetBalance,
} from '@kitzen/data-transfer-objects';
import type { IAssetMetadata } from '@kitzen/assets';

export type CoinIdentifier = Pick<IAssetBalance, 'identifier' | 'network'>;
export type AssetIdentifier = Pick<IAssetBalance, 'identifier' | 'balance' | 'network'>;
export type AssetIdentifierWithRate = Pick<IAssetBalance, 'identifier' | 'balance' | 'network' | 'rate'>;

export class PrintTool {
  private usdFormatter = new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' });

  public constructor(private readonly assetsInfo: {
    [network: string]: {
      [identifier: string]: IAssetMetadata;
    };
  }) {
  }

  public printFiat(num?: number): string {
    return this.usdFormatter.format(num || 0);
  }

  public printRate(num?: string): string {
    return this.printFiat(num ? Number(num) : undefined);
  }

  public printTransactionId(tx: string): string {
    if (tx?.length > 20) {
      return `${tx.substring(0, 6)}..${tx.substring(tx.length - 11, tx.length)}`;
    }
    return tx;
  }

  public printCrypto(num: number, network: BlockchainNetworkEnum, identifier: string = 'coin'): string {
    if (!num || !network || !identifier) {
      return '?';
    }
    const coinSymbol = this.assetsInfo[network][identifier].symbol;
    const decimals = this.assetsInfo[network][identifier].decimals;
    return `${num.toFixed(decimals)} ${coinSymbol}`;
  }

  public printCoinName(network: BlockchainNetworkEnum, identifier: string): string {
    return this.assetsInfo[network]?.[identifier]?.symbol || '?';
  }

  public getDecimals(network: BlockchainNetworkEnum, identifier: string): number {
    return this.assetsInfo[network]?.[identifier]?.decimals || 1;
  }

  public printCryptoFromNativeStr(num: string, network: BlockchainNetworkEnum, identifier = 'coin'): string {
    return this.printCrypto(Number(num), network, identifier);
  }

  public printFiatAsset(asset?: AssetIdentifierWithRate): string {
    return this.printFiat(this.getAssetInFiat(asset));
  }

  public getAssetInCrypto(asset?: AssetIdentifier): number {
    if (!asset) {
      return 0;
    }
    let decimals = this.assetsInfo[asset.network][asset.identifier].decimals;
    return Number(asset.balance) / Math.pow(10, decimals);
  }

  public stringCryptoToBigIngSatoshi(asset?: AssetIdentifier): bigint {
    if (!asset || !asset.balance) {
      return BigInt(0);
    }
    const decimals = this.assetsInfo[asset.network][asset.identifier].decimals;
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
    return this.printCrypto(this.getAssetInCrypto(asset), asset.network, asset.identifier);
  }

  public getAssetInFiat(asset?: AssetIdentifierWithRate): number {
    if (!asset) {
      return 0;
    }
    return Number(asset.rate) * this.getAssetInCrypto(asset);
  }

  public printDate(date: string): string {
    return new Date(date).toLocaleString('en-GB', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

}


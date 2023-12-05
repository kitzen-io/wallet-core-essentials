import { BlockchainNetworkEnum } from '@kitzen/data-transfer-objects';

export function getTransactionExplorerUrl(id: string, network: BlockchainNetworkEnum): string {
  switch (network) {
    case BlockchainNetworkEnum.BTC:
      return `https://www.blockchain.com/btc/tx/${id}`;
    case BlockchainNetworkEnum.TRC20:
    case BlockchainNetworkEnum.TRC10:
      return `https://tronscan.org/#/transaction/${id}`;
    case BlockchainNetworkEnum.ETH:
      return `https://etherscan.io/tx/${id}`
    default:
      throw Error(`Unsupported network ${network}`);
  }
}

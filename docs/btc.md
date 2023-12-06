## Btc

> #### getWalletPrivateData(secret: string, addressAmount: number) => [WalletPrivateData](./interfaces.md#walletprivatedata)
> Use to get data from mnemonic or master private key. Can be used during creating/importing wallet

> #### validatePrivateKey(xprv: string) => boolean
> Use to validate private key to be valid to use anywhere

> #### signMessage(message: string, derivePath: string, privateKeyBase58: string): string
> Use to sign btc message

> #### private getBTCAddress(wallet: BIP32Interface, network?: Network): string
> Use to get user's btc address

> #### getMasterPrivateKeyBase58FromSecret(secret: string): string
> Use to get master private key from user's secret

> #### getEthPrivateKeyBase58FromSecret(masterKey: string): string
> Use to get ethereum private key from user's secret

> #### getEcpair(path: string, privateKeyBase58: string): ECPairInterface
> Use to get ecpair by path and user's private key

> #### calculateTransactionVirtualSize(params: Omit<[CreateTransactionInput](./interfaces.md#createtransactioninput), 'fee'>): number
> Use to calculate btc transaction virtual size

> #### createTransaction(params: Omit<[CreateTransactionInput](./interfaces.md#createtransactioninput), 'pricePerByte'>): Transaction
> Use to create transaction object with ability to get hash from transaction input data

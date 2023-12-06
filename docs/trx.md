## Tron

> #### hexToBase58(value: string) => string
> This function is used to convert a hexadecimal string to a Base58 string.

> #### decodeContractData(value: [DecodeContractDataParam](./interfaces.md#decodecontractdataparam)) => [DecodeContractDataResult](./interfaces.md#decodecontractdataparam)
> This function is used to decode contract data.

> #### getAddressFromPrivateKey(privateKeyHex: string) => [Address](./interfaces.md#address)[]
> This function is used to retrieve the address from a provided private key in the hexadecimal format.

> #### base58toHex(value: string) => string
> This function is used to convert a Base58 string to its hexadecimal representation.

> #### validateAddress(address: string) => boolean
> This function is used to validate whether the provided Tron address is valid or not.

> #### signMessage(message: string, privateKeyHex: string) => string
> This function is used to sign a message with a provided private key in hexadecimal format.

> #### estimateTransactionFee({ accountResources, ...parameters }: [EstimateTransactionFeeProps](./interfaces.md#estimatetransactionfeeprops)) => number
> This function is used to estimate the transaction fee given account resources and other parameters.

> #### createTrc10Transaction(args: [CreateTrc10TransactionParams](./interfaces.md#createtrc10transactionparams)) => any
> This function is used to create a TRC10 transaction.

> #### createTrxTransaction(args: [CreateTrxTransactionParams](./interfaces.md#createtrxtransactionparams)) => any
> This function is used to create a TRX transaction.

> #### getTriggerConstantContractRequest(args: [GetTriggerConstantContractParams](./interfaces.md#gettriggerconstantcontractparams)) => [GetTriggerConstantContractResponse](./interfaces.md#GetTriggerConstantContractResponse)
>This function is used to get a request to trigger a constant contract.

> #### createTrc20Transaction(args: [CreateTrc20TransactionParams](./interfaces.md#createtrc20transactionparams)) => any
> This function is used to create a TRC20 transaction.

> #### signTransaction(transaction: any, privateKey: string) => string
> This function is used to sign a transaction with a provided private key.

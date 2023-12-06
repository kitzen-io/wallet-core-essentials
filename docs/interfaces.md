## Interfaces


## BIP39API

> #### mnemonicToSeed(mnemonic: string): Buffer
> Converts a mnemonic into a seed in Buffer format.

> #### generateMnemonic(): Promise<string>
> Asynchronously generates a mnemonic.

> #### validateMnemonic(mnemonic: string, wordlist?: string[]): boolean
> Validates a mnemonic. An optional wordlist can be specified.

> #### wordlists: { [index: string]: string[] }
> A collection of wordlists available for mnemonic generation. Each index corresponds to a specific language.


### Address

> #### address: string
> The blockchain address or hash of the public key.

> #### derivePath: string
> The derivation path used for generating the blockchain address.

### WalletPrivateData

> #### privateKeyBase58: string
> The private key for the wallet in Base58 format.

> #### privateKeyTronHex: string
> The private key for Tron in hexadecimal format.

> #### privateKeyEthBase58: string
> The private key for Ethereum in Base58 format.

> #### addressReceive: Address[]
> An array of addresses for receiving payments.

> #### addressChange: Address[]
> An array of addresses for receiving change.

### CreateTransactionInput

> #### utxo: IUnspentTransaction[]
> The Unspent Transaction Outputs (UTXOs) that will be used as inputs for the transaction.

> #### amount: bigint
> The amount to be transferred.

> #### to: string
> The receiver's address.

> #### changeAddress: string
> The address for receiving change.

> #### pricePerByte: number
> The price per byte for this transaction.

> #### spendOwnFee: boolean
> Flag whether the account spending the UTXOs will pay the transaction fee.

> #### fee: bigint
> The total fee for the transaction.

> #### allAddresses: IAddressDto[]
> All addresses held by the user.

> #### privateKeyBase58: string
> The private key used for signing the transaction. Encoded as a Base58 string.

### CreateTrc10TransactionParams

> #### amount: string
> The amount to be transferred.

> #### to: string
> The destination address.

> #### from: string
> The sender's address.

> #### blockInfo: ITronGetBlockResponse
> Information about the block for constructing the transaction.

> #### feeLimit: number
> The fee limit for constructing the transaction.

> #### contractAddress?: string
> The contract address (optional) for the transaction.

### CreateTrc20TransactionParams

> #### contractAddress: string
> The contract address for the transaction. This is mandatory for TRC20 transactions.

## CreateTrxTransactionParams

> #### network: BlockchainNetworkEnum
> The blockchain network.

### GetTriggerConstantContractParams

> #### ownerAddress: string
> The owner's address.

> #### contractAddress: string
> The contract's address.

> #### to: string
> The recipient's address.

> #### amount: string
> The amount to be transferred.

### DecodeContractDataResult

> #### fromAddress: string
> The sender's address.

> #### toAddress: string
> The recipient's address.

> #### amount: bigint
> The amount that was transferred.

### DecodeContractDataParam

> #### amount?: number
> The transferred amount (optional).

> #### owner_address: string
> The sender's address.

> #### to_address?: string
> The recipient's address (optional).

> #### data?: string
> The data (optional) associated with the contract.

### GetTriggerConstantContractResponse

> #### owner_address: string
> The owner's address.

> #### contract_address: string
> The contract's address.

> #### function_selector: string
> The selected function for the contract call.

> #### parameter: string
> The parameters for the contract call.

> #### visible: boolean
> Flag indicating the visibility of the contract.

### EstimateTransactionFeeProps

> #### accountResources: ITronGetAccountResourcesResponse
> Account's resources for executing the transaction.

> #### network: BlockchainNetworkEnum
> The blockchain network.

> #### contractAddress?: string
> The contract's address (optional).

> #### bandwidthPrice: number
> The price of bandwidth.

> #### energyPrice: number
> The price of energy.

> #### energyNeeded: number
> The energy required for the transaction.

> #### from: string
> The sender's address.

> #### feeLimit: number
> The fee limit for the transaction.

> #### to: string
> The recipient's address.

> #### amount: string
> The transaction amount.

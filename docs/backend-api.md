## Backend Api

> #### getPostAddressDto: (data: [WalletPrivateData](./interfaces.md#walletprivatedata), message: string) =>`Promise<IUserAddressRequest>`
> Use when you need to map addresses from data that you received from [Btc](./btc.md).getWalletPrivateData
and message that you received from `/user/auth/message`

> #### getVerifyMessageDto: (data: [WalletPrivateData](./interfaces.md#walletprivatedata), message: string) => IUserAuthVerifyMessageRequest
> Use when you need to get data to verify addresses

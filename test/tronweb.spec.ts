const TronWeb = require('tronweb');

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: {'TRON-PRO-API-KEY': PUBLIC_KEY},
  privateKey: PRIVATE_KEY,
});

// This scenario doesn't test actual code in src, but rather provides a way to debug how tronweb works
test.skip('tronweb', async () => {
    const {transaction, result} = await tronWeb.transactionBuilder.triggerSmartContract(
      'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // smart contract address
      'transfer(address,uint256)',
      {
        feeLimit: 10000000,
        callValue: 0,
      },
      [
        {
          type: 'address',
          value: 'TCXFzBg8XjZF2NUjDSzSxXLBxeZxgPpS5o', // too
        },
        {
          type: 'uint256',
          value: '1000000',
        },
      ],
      tronWeb.address.toHex('TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht'), // from
  );
  expect(transaction.raw_data_hex).toBeDefined();
})

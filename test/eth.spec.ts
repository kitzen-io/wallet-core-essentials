import {Ethereum} from "../src/eth/eth";
import {ethers} from "ethers";
import {decodedEscrowTransaction, escrowTx, ethMessage, ethPrivateKey, ethSignature, ethToAddress, ethTx, usdcTx} from "./fixtures/consts";
import {ESCROW_ABI} from "@kitzen/escrow-contract";


describe('Ethereum', () => {
    let ethereum: Ethereum;


    beforeEach(() => {
        ethereum = new Ethereum();
    });

    describe('getEthAddressFromPrivateKey', () => {
        it('should return the correct address', () => {
            const address = ethereum.getEthAddressFromPrivateKey(ethPrivateKey);
            expect(address).toStrictEqual([{address: "0xE704aa04CDE541bDEA56933434bEBC101b855132", derivePath: "m/44'/60'/0'/0/0"}]);
        });
    });

    describe('signMessage', () => {
        it('should sign message', async () => {
            const sign = await ethereum.signMessage(ethMessage, ethPrivateKey)
            expect(sign).toStrictEqual(ethSignature)
        });
    });

    describe('verifyAddress', () => {
        it('should validate address', async () => {
            const verifiedAddress = ethers.verifyMessage(ethMessage,ethSignature)
            const address = ethereum.getEthAddressFromPrivateKey(ethPrivateKey);

            expect(verifiedAddress).toBe(address[0].address)
        })
    })

    describe('signTransaction ETH', () => {
        it('should sign eth transaction', async () => {
            const tx = await ethereum.signTransaction(ethPrivateKey,{
                from: "0xE704aa04CDE541bDEA56933434bEBC101b855132",
                to: "0x7cb96d606F6d33C8811168ceB7A80c909d00CF29",
                value: "0",
                chainId: 0x1,
                "maxFeePerGas": "74831204321",
                "maxPriorityFeePerGas": "38259235",
                gasLimit: 21000,
                nonce: 1
            })

            expect(tx).toStrictEqual(ethTx)
        })
    })

    describe('signTransaction USDC', () => {
        it ('should sign link transaction', async () => {
            const tx = await ethereum.signTransaction(ethPrivateKey,{
                from: "0xE704aa04CDE541bDEA56933434bEBC101b855132",
                to: "0x7cb96d606F6d33C8811168ceB7A80c909d00CF29",
                value: "0",
                chainId: 0x1,
                "maxFeePerGas": "74831204321",
                "maxPriorityFeePerGas": "38259235",
                gasLimit: 21000,
                nonce: 1
            },  { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', props: ['0x7cb96d606F6d33C8811168ceB7A80c909d00CF29', ethers.parseUnits('1', 9)], method: 'transfer' })

            expect(tx).toStrictEqual(usdcTx)
        })
    })

    describe('signTransaction Escrow', () => {
        it ('should sign escrow transaction', async () => {
            const value = ethers.parseEther('0.000001')
            const fee = BigInt(Number(value) * (25 / 10000)) // Calculating value to pay + half platform fee (50(0.5%) / 2 = 25(0.25%))

            const tx = await ethereum.signTransaction(ethPrivateKey,{
                from: "0xE704aa04CDE541bDEA56933434bEBC101b855132",
                to: '0x7cb96d606F6d33C8811168ceB7A80c909d00CF29',
                value: value + fee, // This value must be the same as value in contract parameters + half platform fee
                chainId: 0x1,
                "maxFeePerGas": "74831204321",
                "maxPriorityFeePerGas": "38259235",
                gasLimit: 21000,
                nonce: 1
            },  {
                address: '0xaC249BC891fD8FFb5072230fa87c441777E25bC7', // Must be escrow contract address
                abi: ESCROW_ABI,
                props: [
                    '0x9ed27d7002b19bc9e4b25ff460fe857c', // Trade id in bytes16 hex
                    '0xE704aa04CDE541bDEA56933434bEBC101b855132', // Seller address
                    '0x7cb96d606F6d33C8811168ceB7A80c909d00CF29', // Buyer address
                    ethers.parseEther('0.000001'), // Value supposed to be transferred, in Wei
                    25, // Half Fee value (1 = 0.01% from value)
                    0, // Payment window in seconds, time during seller can't cancel trade
                ],
                method: 'createEscrow', // Method of function in contract
            })

            expect(tx).toStrictEqual(escrowTx)
        })
    })

    describe('validateAddress', () => {
        it('should validate address', async () => {
            const isValid = ethereum.validateAddress(ethToAddress)

            expect(isValid).toBe(true)
        })
    })
    describe('getGasInEth', () => {
        it('should convert gas to eth number', async () => {
            const eth = ethereum.getGasInEth(27976924723, 21000)

            expect(eth).toBe(0.000587515419183)
        })
    })

    describe('decodeTransaction', () => {
        it('should decode transaction', () => {
            const result = ethereum.decodeTransaction(escrowTx, { abi: ESCROW_ABI, method: 'createEscrow' })
            expect(result).toStrictEqual(decodedEscrowTransaction)
        })
    })
});

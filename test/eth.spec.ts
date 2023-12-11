import {Ethereum} from "../src/eth/eth";
import {ethers} from "ethers";
import {ethMessage, ethPrivateKey, ethSignature, ethToAddress, ethTx, linkTx} from "./fixtures/consts";


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

    describe('signTransaction LINK', () => {
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
            },  "0x326C977E6efc84E512bB9C30f76E30c160eD06FB")

            expect(tx).toStrictEqual(linkTx)
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
});

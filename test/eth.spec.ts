import {Ethereum} from "../src/eth/eth";
import {ethers} from "ethers";
import {ethMessage, ethPrivateKey, ethSignature, ethToAddress, ethTx} from "./fixtures/consts";


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

    describe('signTransaction', () => {
        it('should sign transaction', async () => {
            const tx = await ethereum.signTransaction(ethPrivateKey,{
                to: ethToAddress,
                value: ethers.parseUnits("0", "ether")
            })

            expect(tx).toStrictEqual(ethTx)
        })
    })
});

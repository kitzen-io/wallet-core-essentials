import {Ethereum} from "../src/eth/eth";
import {ethers} from "ethers";


describe('Ethereum', () => {
    let ethereum: Ethereum;
    const privateKey = 'xprvA1MzT94xpgCNrpZcnhLxznaiBdkPnjKBxMzj8YkFZG8qAafQTW28vJhaSPb1ssf9VqwctVLTnMJ5Ex388BJKuWtf6CdAUgp8pQCuc1obxBN';
    const message = "64cfa063-188a-4750-9b7d-593259eb2075"
    const signature = "0x30862506c8ba7d937d420ca02adfb49adca1e50117defe48acbc641e3483b06b5e9f53c8a757d8f6630818742a20b76e0204d942eb01d16501599ca8b081a1281c"


    beforeEach(() => {
        ethereum = new Ethereum();
    });

    describe('getEthAddressFromPrivateKey', () => {
        it('should return the correct address', () => {
            const address = ethereum.getEthAddressFromPrivateKey(privateKey);
            expect(address).toStrictEqual([{address: "0xE704aa04CDE541bDEA56933434bEBC101b855132", derivePath: "m/44'/60'/0'/0/0"}]);
        });
    });

    describe('signMessage', () => {
        it('should sign message', async () => {
            const sign = await ethereum.signMessage(message, privateKey)
            expect(sign).toStrictEqual(signature)
        });
    });

    describe('verifyAddress', () => {
        it('should validate address', async () => {
            const verifiedAddress = ethers.verifyMessage(message,signature)
            const address = ethereum.getEthAddressFromPrivateKey(privateKey);

            expect(verifiedAddress).toBe(address[0].address)
        })
    })
});

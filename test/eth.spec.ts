import {Ethereum} from "../src/eth/eth";


describe('Ethereum', () => {
    let ethereum: Ethereum;

    beforeEach(() => {
        ethereum = new Ethereum();
    });

    describe('getEthAddressFromPrivateKey', () => {
        it('should return the correct address', () => {
            const privateKey = 'xprvA1MzT94xpgCNrpZcnhLxznaiBdkPnjKBxMzj8YkFZG8qAafQTW28vJhaSPb1ssf9VqwctVLTnMJ5Ex388BJKuWtf6CdAUgp8pQCuc1obxBN';
            const address = ethereum.getEthAddressFromPrivateKey(privateKey);
            expect(address).toStrictEqual([{address: "0xE704aa04CDE541bDEA56933434bEBC101b855132", derivePath: "m/44'/60'/0'/0/0"}]);
        });
    });

    describe('signMessage', () => {
        it('should sign message', async () => {
            const privateKey = 'xprvA1MzT94xpgCNrpZcnhLxznaiBdkPnjKBxMzj8YkFZG8qAafQTW28vJhaSPb1ssf9VqwctVLTnMJ5Ex388BJKuWtf6CdAUgp8pQCuc1obxBN';
            const sign = await ethereum.signMessage("64cfa063-188a-4750-9b7d-593259eb2075", privateKey)
            expect(sign).toStrictEqual('0x3537c3275fd591035f97a02ccff8b7d189cb25463d0b43b09be6b03bff6dd7c61d514bbee7fa1495505120a3d22c1e2db9fc6aa7659a4f7d6b0633c61619c2a51c')
        });
    });
});

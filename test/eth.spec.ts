import {Ethereum} from "../src/eth/eth";


describe('Ethereum', () => {
    let ethereum: Ethereum;

    beforeEach(() => {
        ethereum = new Ethereum();
    });

    describe('getEthAddressFromPrivateKey', () => {
        it('should return the correct address', () => {
            const privateKey = 'xprvA2af7XVoXiG6XgrR51AtpsaMkSwXks8x97yztoEzteaB3VReDxv2RMx7HukgKNR4nTCniVdri2Kq6U8Uu294HQDZm9FKrrKTZDWJAeokaZv';
            const address = ethereum.getEthAddressFromPrivateKey(privateKey);
            expect(address).toStrictEqual([{address: "0xE704aa04CDE541bDEA56933434bEBC101b855132", derivePath: "m/84'/0'/0'/0/0"}]);
        });
    });

    describe('signMessage', () => {
        it('should sign message', () => {
            const privateKey = 'xprvA2af7XVoXiG6XgrR51AtpsaMkSwXks8x97yztoEzteaB3VReDxv2RMx7HukgKNR4nTCniVdri2Kq6U8Uu294HQDZm9FKrrKTZDWJAeokaZv';
            ethereum.signMessage('dcf55538-a69a-4b24-a7c7-bbbba4ec19f3', privateKey)
        });
    });
});

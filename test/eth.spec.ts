import {Ethereum} from "../src/eth/eth";


describe('Ethereum', () => {
    let ethereum: Ethereum;

    beforeEach(() => {
        ethereum = new Ethereum();
    });

    describe('getEthAddressFromPrivateKey', () => {
        it('should call ethers.HDNodeWallet.fromExtendedKey with the private key and return the address', () => {
            const privateKey = 'xprvA2af7XVoXiG6XgrR51AtpsaMkSwXks8x97yztoEzteaB3VReDxv2RMx7HukgKNR4nTCniVdri2Kq6U8Uu294HQDZm9FKrrKTZDWJAeokaZv';
            const address = ethereum.getEthAddressFromPrivateKey(privateKey);
            expect(address).toBe('0xE704aa04CDE541bDEA56933434bEBC101b855132');
        });
    });
});

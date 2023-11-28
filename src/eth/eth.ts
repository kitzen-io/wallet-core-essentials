import {ethers} from "ethers";

export class Ethereum {
    public getEthAddressFromPrivateKey(privateKey: string): string {
        return ethers.HDNodeWallet.fromExtendedKey(privateKey).address
    }
}

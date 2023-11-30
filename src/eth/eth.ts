import {ethers} from "ethers";
import {Address} from "../interface/interfaces";

export class Ethereum {
    public getEthAddressFromPrivateKey(privateKey: string): [Address] {
        const address = ethers.HDNodeWallet.fromExtendedKey(privateKey).derivePath("0").address
        return [{ address, derivePath: "m/44'/60'/0'/0/0" }]
    }

    public async signMessage(message: string, privateKey: string): Promise<string> {
        return await ethers.HDNodeWallet.fromExtendedKey(privateKey).derivePath("0").signMessage(message)
    }
}

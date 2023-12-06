import {Contract, ethers, TransactionRequest} from "ethers";
import {Address} from "../interface/interfaces";
import ERC20_ABI from './erc20.abi.json'

export class Ethereum {

    public getEthAddressFromPrivateKey(privateKey: string): [Address] {
        const address = ethers.HDNodeWallet.fromExtendedKey(privateKey).derivePath("0").address
        return [{ address, derivePath: "m/44'/60'/0'/0/0" }]
    }

    public async signMessage(message: string, privateKey: string): Promise<string> {
        return await ethers.HDNodeWallet.fromExtendedKey(privateKey).derivePath("0").signMessage(message);
    }

    public async signTransaction(privateKey: string, tx: TransactionRequest, erc20ContractAddress?: string): Promise<string> {
        const signer = ethers.HDNodeWallet.fromExtendedKey(privateKey)

        if (erc20ContractAddress) {
            const contract = new Contract(erc20ContractAddress, ERC20_ABI)

            const data = contract.interface.encodeFunctionData("transfer", [tx.to, tx.value])
            return signer.signTransaction({...tx, data})
        }

        return signer.signTransaction(tx)
    }

    public validateAddress(address: string): boolean {
        try {
            return !!ethers.getAddress(address)
        } catch {
            return false
        }
    }
}

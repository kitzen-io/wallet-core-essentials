import {BigNumberish, Contract, ethers, TransactionRequest} from "ethers";
import {Address, EthContractParams} from "../interface/interfaces";
import ERC20_ABI from './erc20.abi.json'

export class Ethereum {

    public getAddressFromPrivateKey(privateKey: string): [Address] {
        const address = ethers.HDNodeWallet.fromExtendedKey(privateKey).derivePath("0").address
        return [{ address, derivePath: "m/44'/60'/0'/0/0" }]
    }

    public async signMessage(message: string, privateKey: string): Promise<string> {
        return await ethers.HDNodeWallet.fromExtendedKey(privateKey).derivePath("0").signMessage(message);
    }

    public async signTransaction(privateKey: string, tx: TransactionRequest, erc20Contract?: EthContractParams): Promise<string> {
        const signer = ethers.HDNodeWallet.fromExtendedKey(privateKey).derivePath('0')

        if (erc20Contract) {
            const params = { abi: ERC20_ABI, ...erc20Contract }

            const contract = new Contract(erc20Contract.address, params.abi)

            const data = contract.interface.encodeFunctionData(params.method, params.props)
            return signer.signTransaction({ ...tx, to: erc20Contract.address, data })
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

    public getGasInEth = (gas: BigNumberish, gasLimit: number) => {
        return Number(ethers.formatUnits(gas, 'ether')) * gasLimit
    }

    public decodeTransaction = (hash: string, contract?: { abi: any, method: string }) => {
        const tx = ethers.Transaction.from(hash)
        const result: { transaction: ethers.Transaction, data?: any } = {
            transaction: tx.toJSON(),
        }
        if (contract) {
            const data = {}

            const abiCoder = new ethers.Interface(contract.abi)
            const methodInputs = JSON.parse(abiCoder.formatJson()).find(obj => obj.name === contract.method).inputs
            const decodedData = abiCoder.decodeFunctionData(contract.method, tx.data)

            methodInputs.forEach(({ name }, idx) => {
                data[name.slice(1)] = decodedData[idx];
            })

            result.data = data
        }

        return result
    }
}

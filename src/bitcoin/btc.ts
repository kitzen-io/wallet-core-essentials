// import { IBip32Derivation } from '@prominence-group/common-lib/web';
import {
  BIP32API,
  BIP32Interface,
} from 'bip32';
import {
  Network,
  networks,
  payments,
  Psbt,
} from 'bitcoinjs-lib';
import * as bitcoinMessage from 'bitcoinjs-message';
import {
  ECPairAPI,
  ECPairInterface,
} from 'ecpair';
import {
  BIP39API,
  CreateTransactionInput,
  WalletPrivateData,
} from '../interface/interfaces';
import { TransactionInput } from 'bitcoinjs-lib/src/psbt';
import type { PsbtInput } from 'bip174/src/lib/interfaces';
import {
  IAddressDto,
  TransactionErrorsEnum,
} from '@kitzen/data-transfer-objects';
import type { Transaction } from 'bitcoinjs-lib';

export class Btc {

  public constructor(
    private ecPair: ECPairAPI,
    private bip32: BIP32API,
    private bip39: BIP39API,
  ) {
  }

  public getWalletPrivateData(mnemonic: string, addressAmount = 10): WalletPrivateData {
    const seed = this.bip39.mnemonicToSeed(mnemonic);
    const privateKeyBase58 = this.bip32.fromSeed(seed).toBase58();

    const wallet = this.bip32.fromBase58(privateKeyBase58)!;

    const addressReceive: any = [];
    const addressChange: any = [];

    let bip32Interface = wallet.derivePath('m/44\'/195\'/0\'/0/0');
    const privateKeyHex = bip32Interface.privateKey!.toString('hex');

    for (let i = 0; i < addressAmount; i++) {
      const address1 = this.getBTCAddress(wallet.derivePath(`m/84'/0'/0'/0/${i}`));
      const address2 = this.getBTCAddress(wallet.derivePath(`m/84'/0'/0'/1/${i}`));

      if (address1) {
        addressReceive.push({
          address: address1,
          derivePath: `m/84'/0'/0'/0/${i}`,
        });
      }

      if (address2) {
        addressChange.push({
          address: address2,
          derivePath: `m/84'/0'/0'/1/${i}`,
        });
      }
    }

    return {
      seed,
      privateKeyBase58,
      addressReceive,
      addressChange,
      privateKeyHex,
    };
  }

  //
  // public generatePublicKey(): { publicKey: string, derivationPath: string} {
  //   const xpriv = State.getStateByKey(StateKeys.X_PRIV);
  //
  //   const randomIndex: number = getRandomDerivationIndex();
  //   const derivationPath = `m/84'/0'/0'/0/${randomIndex}`;
  //
  //   const wif = this.bip32
  //     .fromBase58(xpriv, networks.bitcoin)
  //     .derivePath(derivationPath)
  //     .toWIF();
  //
  //   const keyPair: ECPairInterface = this.ecPair.fromWIF(wif);
  //
  //   return { publicKey: keyPair!.publicKey.toString('hex'), derivationPath };
  // }
  //
  // public getZPub(): string {
  //   const xpriv = State.getStateByKey(StateKeys.X_PRIV);
  //
  //   const xpub = this.bip32
  //     .fromBase58(xpriv, networks.bitcoin)
  //     .derivePath("m/84'/0'/0'")
  //     .neutered()
  //     .toBase58();
  //
  //   return convertXpub(xpub, ConvertPubKeysPrefixes.zPub);
  // }
  //
  // public getEcpair(path: string = DEFAULT_PATH): ECPairInterface {
  //   const xpriv = State.getStateByKey(StateKeys.X_PRIV);
  //
  //   const wif = this.bip32.fromBase58(xpriv, networks.bitcoin).derivePath(path).toWIF();
  //
  //   return this.ecPair.fromWIF(wif);
  // }
  //
  public signMessage(message: string, derivePath: string, privateKeyBase58: string): string {
    const wif = this.bip32.fromBase58(privateKeyBase58, networks.bitcoin).derivePath(derivePath).toWIF();
    const keyPair = this.ecPair.fromWIF(wif);
    const signature = bitcoinMessage.sign(message, keyPair.privateKey!, keyPair.compressed, { segwitType: 'p2wpkh' });
    return signature.toString('base64');
  }

  //
  // public validateTransaction(pubkey: Buffer, msghash: Buffer, signature: Buffer): boolean {
  //   return this.ecPair.fromPublicKey(pubkey).verify(msghash, signature);
  // }
  //
  private getBTCAddress(wallet: BIP32Interface, network?: Network): string {
    return payments.p2wpkh({ pubkey: wallet.publicKey, network }).address!;
  }

  public getEcpair(path: string, privateKeyBase58: string): ECPairInterface {
    const wif = this.bip32.fromBase58(privateKeyBase58, networks.bitcoin).derivePath(path).toWIF();
    return this.ecPair.fromWIF(wif);
  }

  public calculateTransactionVirtualSize(params: Omit<CreateTransactionInput, 'fee'>): number {
    // Create a transaction without see and see how many bytes it would have
    let transaction = this.createTransaction({ ...params, fee: BigInt(0) });

    // include the fee in transaction and recalculate its virtual size again.
    let fee = BigInt(transaction.virtualSize() * params.pricePerByte);
    // Then we create and return a real transaction here
    // of course there's a chance that fee would be different and virtualSize as well, but it's small.
    return this.createTransaction({ ...params, fee }).virtualSize();
  }

  public createTransaction(params: Omit<CreateTransactionInput, 'pricePerByte'>): Transaction {
    const transaction = new Psbt({ network: networks.bitcoin });
    let unspentAmount = BigInt(0);

    let amountToReceive: number = 0;
    const inputs: TransactionInput[] = [];
    for (const utx of params.utxo) {
      // we got enough money from current unspent transaction output, so we don't need more
      if (unspentAmount >= params.amount + params.fee) {
        break;
      }

      unspentAmount = unspentAmount + BigInt(utx.amount);
      const input: TransactionInput & PsbtInput = {
        hash: utx.txId,
        index: utx.vout,
        witnessUtxo: {
          script: Buffer.from(utx.script, 'hex'),
          value: +utx.amount,
        },
      };
      inputs.push(input);
    }
    transaction.addInputs(inputs);


    const requiredAmount: bigint = params.spendOwnFee ? params.amount + params.fee : params.amount - params.fee;
    if (requiredAmount > unspentAmount) {
      throw new Error(TransactionErrorsEnum.INSUFFICIENT_FUNDS);
    }

    if (params.spendOwnFee) {
      amountToReceive = +params.amount.toString();
    } else {
      amountToReceive = +(params.amount - params.fee).toString();
    }

    const diff = unspentAmount - params.amount - params.fee;

    transaction.addOutput({
      address: params.to,
      value: amountToReceive,
    });

    if (diff > 0) {
      transaction.addOutput({
        address: params.changeAddress,
        value: +diff.toString(),
      });
    }

    for (let i = 0; i < inputs.length; i++) {
      const utx = params.utxo[i];

      const foundedAddress: IAddressDto | undefined = params.allAddresses.find((addressInstanse) => addressInstanse.address === utx.address);
      if (!foundedAddress) {
        throw new Error(TransactionErrorsEnum.SIGN_ISSUE);
      }

      transaction.signInput(i, this.getEcpair(foundedAddress.path, params.privateKeyBase58));
    }

    transaction.finalizeAllInputs();

    return transaction.extractTransaction();
  }


  //
  // public async signTransaction(psbtBase64: string, derivationPath: string): Promise<string> {
  //   const seed: null | Buffer = State.getSeed();
  //
  //   const psbt: Psbt = Psbt.fromBase64(psbtBase64);
  //
  //   const hdRoot: BIP32Interface = this.bip32.fromSeed(seed);
  //
  //   const systemDerivation: IBip32Derivation = await getDerivation({ hdRoot }, derivationPath);
  //
  //   return psbt
  //     .updateInput(0, { bip32Derivation: [systemDerivation] })
  //     .signInputHD(0, hdRoot)
  //     .toBase64();
  // }
  //
  // public getPsbtOutput(psbtBase64: string): any {
  //   const psbt: Psbt = Psbt.fromBase64(psbtBase64);
  //
  //   const outputs = psbt.txOutputs;
  //
  //   return outputs.map(output => {
  //     return {
  //       address: output.address,
  //       amount: output.value,
  //     }
  //   })
  // }
}


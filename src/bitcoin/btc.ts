// import { IBip32Derivation } from '@prominence-group/common-lib/web';
import {
  BIP32API,
  BIP32Interface,
} from 'bip32';
import type { Transaction } from 'bitcoinjs-lib';
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
  Address,
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
import { validate } from 'bitcoin-address-validation';

export class Btc   {
  public constructor(
    private ecPair: ECPairAPI,
    private bip32: BIP32API,
    private bip39: BIP39API,
  ) {
  }

  public getWalletPrivateData(secret: string, addressAmount = 10): WalletPrivateData {
    const privateKeyBase58 = this.getPrivateKeyBase58FromSecret(secret)

    const wallet = this.bip32.fromBase58(privateKeyBase58)!;

    const addressReceive: Address[] = [];
    const addressChange: Address[] = [];

    let bip32Interface = wallet.derivePath("m/44'/195'/0'/0/0");
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
      privateKeyBase58,
      addressReceive,
      addressChange,
      privateKeyHex,
    };
  }

  public validatePrivateKey(xprv: string): boolean {
    try {
      return !!this.bip32.fromBase58(xprv)
    } catch {
      return false
    }
  }

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

  private getPrivateKeyBase58FromSecret(secret: string): string {
    if (secret.includes(' ')) {
      const seed = this.bip39.mnemonicToSeed(secret)
      return this.bip32.fromSeed(seed).toBase58()
    }
    return secret
  }

  public getEcpair(path: string, privateKeyBase58: string): ECPairInterface {
    const wif = this.bip32.fromBase58(privateKeyBase58, networks.bitcoin).derivePath(path).toWIF();
    return this.ecPair.fromWIF(wif);
  }

  public calculateTransactionVirtualSize(params: Omit<CreateTransactionInput, 'fee'>): number {
    // Create a transaction without fee and see how many bytes it would have
    let transaction = this.createTransaction({ ...params, fee: BigInt(0) });

    // include the fee in transaction and recalculate its virtual size again.
    let fee = BigInt(transaction.virtualSize() * params.pricePerByte);
    // Then we create and return a real transaction here
    // of course there's a chance that fee would be different and virtualSize as well, but it's small.
    return this.createTransaction({ ...params, fee }).virtualSize();
  }

  public validateAddress(address: string): boolean {
    return validate(address);
  }

  public createTransaction(params: Omit<CreateTransactionInput, 'pricePerByte'>): Transaction {
    if (typeof params.amount != 'bigint' || typeof params.fee != 'bigint') {
      // this check is crucial, since amoutn and fee are passes as string from backend
      // And the result of 200 + '400' = 200400,
      // which would lead to a big blunder is someone uses this function incorrectly
      // so typescript typechecking is not enough!
      throw Error('amount and fee should be bigints');
    }
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
}


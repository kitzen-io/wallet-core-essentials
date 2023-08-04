// import { IBip32Derivation } from '@prominence-group/common-lib/web';
import { BIP32API, BIP32Interface } from 'bip32';
import { Network, networks, payments } from 'bitcoinjs-lib';
import * as bitcoinMessage from 'bitcoinjs-message';
import { ECPairAPI } from 'ecpair';
import { BIP39API, WalletPrivateData } from '../interface/interfaces';

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

    const addressReceive = [];
    const addressChange = [];

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


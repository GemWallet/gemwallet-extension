import { Wallet as WalletXRPL } from 'xrpl';
export interface Wallet {
  name: string;
  publicAddress: string;
  seed?: string;
  mnemonic?: string;
}

export interface WalletLedger extends Wallet {
  wallet: WalletXRPL;
}

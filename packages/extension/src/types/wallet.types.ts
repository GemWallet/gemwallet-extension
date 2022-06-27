import { Wallet as WalletXRPL } from 'xrpl';
export interface Wallet {
  name: string;
  publicAddress: string;
  seed: string;
}

export interface WalletLedger extends Omit<Wallet, 'seed'> {
  wallet: WalletXRPL;
}

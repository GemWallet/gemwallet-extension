/// <reference types="react-scripts" />

declare global {
  interface Window {
    gemWallet?: boolean;
    gemWalletApi?: { [key: string]: any };
  }
}

export {};

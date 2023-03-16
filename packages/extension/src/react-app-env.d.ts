/// <reference types="react-scripts" />

declare global {
  interface Window {
    gemWallet?: boolean;
    GemWalletApi?: Record<string, any>;
  }
}

export {};

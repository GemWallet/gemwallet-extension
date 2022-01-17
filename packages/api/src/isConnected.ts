declare global {
  interface Window {
    gemWallet: boolean;
    gemWalletApi: { [key: string]: any };
  }
}

const isConnected = () => !!window.gemWallet;

export = isConnected;

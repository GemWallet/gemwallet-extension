declare global {
  interface Window {
    gemWallet?: boolean;
    gemWalletApi?: { [key: string]: any };
  }
}

const isConnected = () => {
  if (window.gemWallet) {
    return true;
  } else {
    const message = {
      app: 'gem-wallet',
      type: 'is-extension-installed'
    };
    window.postMessage(message);

    window.addEventListener(
      'message',
      (event) => {
        const {
          data: { app, type, payload }
        } = event;
        // We make sure that the message comes from gem-wallet
        if (app === 'gem-wallet') {
          if (type === 'extension-installed' && payload?.isConnected) {
            window.gemWallet = true;
          }
        }
      },
      false
    );
  }
};

export = isConnected;

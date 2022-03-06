import { GEM_WALLET, REQUEST_CONNECTION } from '@gemwallet/constants/src/message';
import { MessageListenerEvent, IsConnectedResponse } from '@gemwallet/constants/src/message.types';
import { sendMessageToContentScript } from './helpers/extensionMessaging';

declare global {
  interface Window {
    gemWallet?: boolean;
    gemWalletApi?: { [key: string]: any };
  }
}

const isConnected = () => {
  if (window.gemWallet) {
    return new Promise((resolve) => resolve(true));
  } else {
    // If no answer from the extension after 1 second, then return false
    let timeoutId: NodeJS.Timeout;
    const abortConnection = new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(false);
      }, 1000);
    });

    // Trying to connect to the extension
    const connectionToExtension = new Promise(async (resolve, reject) => {
      let response: IsConnectedResponse = { isConnected: false };
      try {
        const message: MessageListenerEvent = {
          app: GEM_WALLET,
          type: REQUEST_CONNECTION
        };
        response = await sendMessageToContentScript(message);
        resolve(response.isConnected);
      } catch (e) {
        reject(e);
      }
    });

    return Promise.race([abortConnection, connectionToExtension]).then((res) => {
      clearTimeout(timeoutId);
      if (res === true) {
        window.gemWallet = true;
      }
      return res;
    });
  }
};

export = isConnected;

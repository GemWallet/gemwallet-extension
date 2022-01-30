import { GEM_WALLET, REQUEST_CONNECTION } from '@gemwallet/constants/src/message';
import { MessageListenerEvent, IsConnectedResponse } from '@gemwallet/constants/src/message.types';
import { sendMessageToContentScript } from './helpers/extensionMessaging';

declare global {
  interface Window {
    gemWallet?: boolean;
    gemWalletApi?: { [key: string]: any };
  }
}

const isConnected = async () => {
  if (window.gemWallet) {
    return true;
  } else {
    let response: IsConnectedResponse = { isConnected: false };
    try {
      const message: MessageListenerEvent = {
        app: GEM_WALLET,
        type: REQUEST_CONNECTION
      };
      response = await sendMessageToContentScript(message);
      if (response.isConnected) {
        window.gemWallet = true;
      }
    } catch (e) {
      console.error(e);
    }

    return response.isConnected;
  }
};

export = isConnected;

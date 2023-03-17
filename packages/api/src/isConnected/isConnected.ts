import { GEM_WALLET, IsConnectedResponse, RequestIsConnectedMessage } from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const isConnected = (): Promise<boolean> => {
  if (window.gemWallet) {
    return new Promise((resolve) => resolve(true));
  } else {
    // If no answer from the extension after 1 second, then return false
    let timeoutId: NodeJS.Timeout;
    const abortConnection = new Promise<boolean>((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(false);
      }, 1000);
    });

    // Trying to connect to the extension
    const connectionToExtension = new Promise<boolean>(async (resolve) => {
      try {
        const message: RequestIsConnectedMessage = {
          app: GEM_WALLET,
          type: 'REQUEST_CONNECTION'
        };
        const response: IsConnectedResponse = await sendMessageToContentScript(message);
        resolve(response.isConnected || false);
      } catch (e) {
        resolve(false);
      }
    });

    return Promise.race([abortConnection, connectionToExtension])
      .then((res) => {
        clearTimeout(timeoutId);
        if (res === true) {
          window.gemWallet = true;
        }
        return res;
      })
      .catch((e) => {
        return false;
      });
  }
};

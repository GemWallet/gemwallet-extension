import { GEM_WALLET, IsConnectedResponse, RequestIsConnectedMessage } from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const isConnected = (): Promise<IsConnectedResponse> => {
  if (window.gemWallet) {
    return Promise.resolve({ result: { isConnected: true } });
  } else {
    // If no answer from the extension after 1 second, then return false
    let timeoutId: NodeJS.Timeout;
    const abortConnection = new Promise<IsConnectedResponse>((resolve) => {
      timeoutId = setTimeout(() => {
        resolve({ result: { isConnected: false } });
      }, 1000);
    });

    // Trying to connect to the extension
    const connectionToExtension = new Promise<IsConnectedResponse>(async (resolve) => {
      try {
        const message: RequestIsConnectedMessage = {
          app: GEM_WALLET,
          type: 'REQUEST_CONNECTION'
        };
        const response = await sendMessageToContentScript(message);
        resolve({ result: { isConnected: response.isConnected || false } });
      } catch (e) {
        resolve({ result: { isConnected: false } });
      }
    });

    return Promise.race([abortConnection, connectionToExtension])
      .then((res) => {
        clearTimeout(timeoutId);
        if (res.result.isConnected === true) {
          window.gemWallet = true;
        }
        return { result: { isConnected: res.result.isConnected } };
      })
      .catch(() => {
        return { result: { isConnected: false } };
      });
  }
};

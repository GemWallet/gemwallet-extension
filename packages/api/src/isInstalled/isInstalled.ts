import { GEM_WALLET, IsInstalledResponse, RequestIsInstalledMessage } from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const isInstalled = (): Promise<IsInstalledResponse> => {
  if (window.gemWallet) {
    return Promise.resolve({ result: { isInstalled: true } });
  } else {
    // If no answer from the extension after 1 second, then return false
    let timeoutId: NodeJS.Timeout;
    const abortConnection = new Promise<IsInstalledResponse>((resolve) => {
      timeoutId = setTimeout(() => {
        resolve({ result: { isInstalled: false } });
      }, 1000);
    });

    // Trying to connect to the extension
    const connectionToExtension = new Promise<IsInstalledResponse>(async (resolve) => {
      try {
        const message: RequestIsInstalledMessage = {
          app: GEM_WALLET,
          type: 'REQUEST_IS_INSTALLED/V3'
        };
        const response = await sendMessageToContentScript(message);
        resolve({ result: { isInstalled: response.isInstalled || false } });
      } catch (e) {
        resolve({ result: { isInstalled: false } });
      }
    });

    return Promise.race([abortConnection, connectionToExtension])
      .then((res) => {
        clearTimeout(timeoutId);
        if (res.result.isInstalled === true) {
          window.gemWallet = true;
        }
        return { result: { isInstalled: res.result.isInstalled } };
      })
      .catch(() => {
        return { result: { isInstalled: false } };
      });
  }
};

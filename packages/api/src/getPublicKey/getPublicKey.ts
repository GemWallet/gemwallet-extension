import { GEM_WALLET, RequestGetPublicKeyMessage } from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getPublicKey = async () => {
  /* {publicKey: string, address: string}
   * null: user refused the authorization
   * undefined: something went wrong
   */
  let response: { publicKey: string; address: string } | undefined | null = undefined;
  try {
    const favicon = getFavicon();
    const message: RequestGetPublicKeyMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_GET_PUBLIC_KEY/V3',
      payload: {
        url: window.location.origin,
        title: document.title,
        favicon
      }
    };
    const receivedMessage = await sendMessageToContentScript(message);
    if (receivedMessage.publicKey && receivedMessage.address) {
      const { publicKey, address } = receivedMessage;
      response = { publicKey, address };
    } else {
      response = receivedMessage;
    }
  } catch (e) {
    throw e;
  }

  return response;
};

import { GEM_WALLET, Message, RequestPublicKeyMessage } from '@gemwallet/constants';
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
    const message: RequestPublicKeyMessage = {
      app: GEM_WALLET,
      type: Message.RequestPublicKey,
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

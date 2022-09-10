import { GEM_WALLET, Message, MessageListenerEvent } from '@gemwallet/constants';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const getPublicKey = async () => {
  /* {publicKey: string, address: string}
   * null: user refused the authorization
   * undefined: something went wrong
   */
  let response: { publicKey: string; address: string } | undefined | null = undefined;
  try {
    let favicon = document.querySelector("link[rel*='icon']")?.getAttribute('href');
    if (favicon) {
      try {
        new URL(favicon);
      } catch (e) {
        favicon = window.location.origin + favicon;
      }
    }
    const message: MessageListenerEvent = {
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

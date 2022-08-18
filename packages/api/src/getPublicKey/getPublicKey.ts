import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { Message, GEM_WALLET, MessageListenerEvent } from '../types';

export const getPublicKey = async () => {
  /* string: public key
   * null: user refused to pass the key
   * undefined: something went wrong
   */
  let response: string | undefined | null = '';
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
    response = await sendMessageToContentScript(message);
  } catch (e) {
    throw e;
  }

  return response;
};

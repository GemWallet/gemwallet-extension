import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { Message, GEM_WALLET, MessageListenerEvent } from '../types';

export const getPublicAddress = async () => {
  /* string: public address
   * null: user refused to pass the public address
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
      type: Message.RequestPublicAddress,
      payload: {
        url: window.location.origin,
        title: document.title,
        favicon
      }
    };
    const { publicAddress } = await sendMessageToContentScript(message);
    response = publicAddress;
  } catch (e) {
    throw e;
  }

  return response;
};

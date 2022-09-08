import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { Message, GEM_WALLET, MessageListenerEvent } from '../types';

export const getAddress = async () => {
  /* string: classic address
   * null: user refused to pass the address
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
      type: Message.RequestAddress,
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

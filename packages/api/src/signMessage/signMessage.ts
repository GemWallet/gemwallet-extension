import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { Message, GEM_WALLET, MessageListenerEvent } from '../types';

export const signMessage = async (message: string) => {
  /* string: signed message
   * null: user refused to pass the public address
   * undefined: something went wrong
   */
  let response: string | null | undefined = undefined;
  try {
    let favicon = document.querySelector("link[rel*='icon']")?.getAttribute('href');
    if (favicon) {
      try {
        new URL(favicon);
      } catch (e) {
        favicon = window.location.origin + favicon;
      }
    }
    const messageToContentScript: MessageListenerEvent = {
      app: GEM_WALLET,
      type: Message.RequestSignMessage,
      payload: {
        url: window.location.origin,
        title: document.title,
        favicon,
        message
      }
    };
    const { signedMessage } = await sendMessageToContentScript(messageToContentScript);
    response = signedMessage;
  } catch (e) {
    throw e;
  }

  return response;
};

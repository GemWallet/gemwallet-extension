import { GEM_WALLET, Message, RequestSignMessageMessage } from '@gemwallet/constants';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const signMessage = async (message: string) => {
  /* string: signed message
   * null: user refused to pass the address
   * undefined: something went wrong
   */
  let response: string | null | undefined = undefined;
  try {
    const favicon = getFavicon();
    const messageToContentScript: RequestSignMessageMessage = {
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

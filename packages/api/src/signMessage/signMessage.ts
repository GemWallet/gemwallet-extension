import { GEM_WALLET, RequestSignMessageMessage, SignMessageResponse } from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const signMessage = async (message: string): Promise<SignMessageResponse> => {
  /* string: signed message
   * null: user refused to pass the address
   * undefined: something went wrong
   */
  let response: SignMessageResponse = { result: undefined };
  try {
    const favicon = getFavicon();
    const messageToContentScript: RequestSignMessageMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SIGN_MESSAGE/V3',
      payload: {
        url: window.location.origin,
        title: document.title,
        favicon,
        message
      }
    };
    const { result } = await sendMessageToContentScript(messageToContentScript);
    response.result = result;
  } catch (e) {
    throw e;
  }

  return response;
};

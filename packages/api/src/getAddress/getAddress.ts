import { GEM_WALLET, Message, RequestAddressMessage } from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getAddress = async () => {
  /* string: classic address
   * null: user refused the authorization
   * undefined: something went wrong
   */
  let response: string | undefined | null = undefined;
  try {
    const favicon = getFavicon();
    const message: RequestAddressMessage = {
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

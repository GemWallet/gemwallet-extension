import { GEM_WALLET, RequestGetAddressMessage } from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getAddress = async () => {
  /* string: classic address
   * null: user refused the authorization
   * undefined: something went wrong
   */
  try {
    const favicon = getFavicon();
    const message: RequestGetAddressMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_GET_ADDRESS/V3',
      payload: {
        url: window.location.origin,
        title: document.title,
        favicon
      }
    };
    const { publicAddress } = await sendMessageToContentScript(message);
    return {
      publicAddress
    };
  } catch (e) {
    throw e;
  }
};

import {
  GetAddressResponsePayload,
  GEM_WALLET,
  RequestGetAddressMessage
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getAddress = async (): Promise<GetAddressResponsePayload> => {
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
    const receivedMessage = await sendMessageToContentScript(message);
    if (!receivedMessage?.result) {
      return receivedMessage;
    }

    const { publicAddress } = receivedMessage?.result;
    return {
      result: { publicAddress }
    };
  } catch (e) {
    throw e;
  }
};

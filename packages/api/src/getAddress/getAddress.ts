import { AddressResponsePayload, GEM_WALLET, RequestGetAddressMessage } from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getAddress = async () => {
  /* string: classic address
   * null: user refused the authorization
   * undefined: something went wrong
   */
  let response: AddressResponsePayload | undefined | null = undefined;
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
    return await sendMessageToContentScript(message);
  } catch (e) {}
  return response;
};

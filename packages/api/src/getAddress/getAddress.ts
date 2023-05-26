import { GEM_WALLET, GetAddressResponse, RequestGetAddressMessage } from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getAddress = async (): Promise<GetAddressResponse> => {
  /* string: classic address
   * null: user refused the authorization
   * undefined: something went wrong
   */
  let response: GetAddressResponse = { result: undefined };
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
    const { result } = await sendMessageToContentScript(message);
    response.result = result;
  } catch (e) {
    throw e;
  }

  return response;
};

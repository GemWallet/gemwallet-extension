import {
  GEM_WALLET,
  GetPublicKeyResponsePayload,
  RequestGetPublicKeyMessage
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getPublicKey = async (): Promise<GetPublicKeyResponsePayload> => {
  /* {publicKey: string, address: string}
   * null: user refused the authorization
   * undefined: something went wrong
   */
  let response: GetPublicKeyResponsePayload = { result: undefined };
  try {
    const favicon = getFavicon();
    const message: RequestGetPublicKeyMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_GET_PUBLIC_KEY/V3',
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

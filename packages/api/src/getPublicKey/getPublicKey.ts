import {
  GEM_WALLET,
  GetPublicKeyResponse,
  RequestGetPublicKeyMessage,
  ResponseType
} from '@gemwallet/constants';
import { deserializeError } from '@gemwallet/extension/src/utils/errors';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getPublicKey = async (): Promise<GetPublicKeyResponse> => {
  /* {publicKey: string, address: string}
   * null: user refused the authorization
   * undefined: something went wrong
   */
  let response: GetPublicKeyResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

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
    const { result, error } = await sendMessageToContentScript(message);
    const parsedError = error ? deserializeError(error) : undefined;
    if (parsedError) {
      throw parsedError;
    }

    if (result) {
      response.type = ResponseType.Response;
      response.result = result;
    }
  } catch (e) {
    throw e;
  }

  return response;
};

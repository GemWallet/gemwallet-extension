import {
  GEM_WALLET,
  GetAddressResponse,
  RequestGetAddressMessage,
  ResponseType
} from '@gemwallet/constants';
import { deserializeError } from '@gemwallet/extension/src/utils/errors';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getAddress = async (): Promise<GetAddressResponse> => {
  /* string: classic address
   * null: user refused the authorization
   * undefined: something went wrong
   */
  let response: GetAddressResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

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

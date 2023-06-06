import {
  GEM_WALLET,
  GetAddressResponse,
  RequestGetAddressMessage,
  ResponseType
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getAddress = async (): Promise<GetAddressResponse> => {
  /* response:
   * if the transaction succeeds:
   * - type: 'response'
   * - result:
   *    - address: classic address
   *
   * if the user rejects the transaction:
   * - type: 'reject'
   * - result: undefined
   *
   * if the transaction fails:
   * - throw an error
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

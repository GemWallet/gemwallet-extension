import {
  GEM_WALLET,
  GetPublicKeyResponse,
  RequestGetPublicKeyMessage,
  ResponseType
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const getPublicKey = async (): Promise<GetPublicKeyResponse> => {
  /* response:
   * if the transaction succeeds:
   * - type: 'response'
   * - result:
   *    - address: string
   *    - publicKey: string
   *
   * if the user rejects the transaction:
   * - type: 'reject'
   * - result: undefined
   *
   * if the transaction fails:
   * - throw an error
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

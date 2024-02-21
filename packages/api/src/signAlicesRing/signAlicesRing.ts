import {
  SignAlicesRingRequest,
  SignAlicesRingResponse,
  GEM_WALLET,
  RequestSignAlicesRingMessage,
  ResponseType
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const signAlicesRing = async (
  payload: SignAlicesRingRequest
): Promise<SignAlicesRingResponse> => {
  /* response:
   * if the transaction succeeds:
   * - type: 'response'
   * - result:
   *    - schnorrSignedMessage
   *
   * if the user rejects the transaction:
   * - type: 'reject'
   * - result: undefined
   *
   * if the transaction fails:
   * - throw an error
   */
  let response: SignAlicesRingResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  try {
    const message: RequestSignAlicesRingMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SIGN_ALICES_RING/V3',
      payload
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

import {
  GEM_WALLET,
  RequestSetTrustlineMessage,
  ResponseType,
  SetTrustlineRequest,
  SetTrustlineResponse
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { deserializeError } from '../utils/errors';

export const setTrustline = async (payload: SetTrustlineRequest): Promise<SetTrustlineResponse> => {
  /* string: hash of the transaction
   * null: user refused the payment
   * undefined: something went wrong
   */
  let response: SetTrustlineResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  try {
    const message: RequestSetTrustlineMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SET_TRUSTLINE/V3',
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

import {
  CancelOfferRequest,
  CancelOfferResponse,
  GEM_WALLET,
  RequestCancelOfferMessage,
  ResponseType
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const cancelOffer = async (payload: CancelOfferRequest): Promise<CancelOfferResponse> => {
  /* response:
   * if the transaction succeeds:
   * - type: 'response'
   * - result:
   *    - hash: transaction hash
   *
   * if the user rejects the transaction:
   * - type: 'reject'
   * - result: undefined
   *
   * if the transaction fails:
   * - throw an error
   */
  let response: CancelOfferResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  try {
    const message: RequestCancelOfferMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_CANCEL_OFFER/V3',
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

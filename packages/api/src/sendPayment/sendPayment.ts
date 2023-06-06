import {
  GEM_WALLET,
  RequestSendPaymentMessage,
  ResponseType,
  SendPaymentRequest,
  SendPaymentResponse
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const sendPayment = async (paymentPayload: SendPaymentRequest) => {
  /* response:
   * if the transaction succeeds:
   * - type: 'response'
   * - result:
   *    - hash: hash of the transaction
   *
   * if the user rejects the transaction:
   * - type: 'reject'
   * - result: undefined
   *
   * if the transaction fails:
   * - throw an error
   */
  let response: SendPaymentResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  try {
    const message: RequestSendPaymentMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SEND_PAYMENT/V3',
      payload: paymentPayload
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

import {
  GEM_WALLET,
  RequestSendPaymentMessage,
  ResponseType,
  SendPaymentRequest,
  SendPaymentResponse
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { deserializeError } from '../utils/errors';

export const sendPayment = async (paymentPayload: SendPaymentRequest) => {
  /* string: hash of the transaction
   * null: user refused the payment
   * undefined: something went wrong
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

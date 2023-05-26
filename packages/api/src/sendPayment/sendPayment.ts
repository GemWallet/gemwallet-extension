import {
  GEM_WALLET,
  SendPaymentRequest,
  RequestSendPaymentMessage,
  SendPaymentResponse
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const sendPayment = async (paymentPayload: SendPaymentRequest) => {
  /* string: hash of the transaction
   * null: user refused the payment
   * undefined: something went wrong
   */
  let response: SendPaymentResponse = { result: undefined };
  try {
    const message: RequestSendPaymentMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SEND_PAYMENT/V3',
      payload: paymentPayload
    };
    const { result } = await sendMessageToContentScript(message);
    response.result = result;
  } catch (e) {}

  return response;
};

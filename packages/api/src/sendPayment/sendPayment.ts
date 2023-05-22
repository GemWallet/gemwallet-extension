import {
  GEM_WALLET,
  PaymentRequestPayload,
  RequestSendPaymentMessage,
  SendPaymentResponse
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const sendPayment = async (paymentPayload: PaymentRequestPayload) => {
  /* string: hash of the transaction
   * null: user refused the payment
   * undefined: something went wrong
   */
  let response: SendPaymentResponse | null | undefined = undefined;
  try {
    const message: RequestSendPaymentMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SEND_PAYMENT/V3',
      payload: paymentPayload
    };
    const response = await sendMessageToContentScript(message);
    return {
      result: response.result
    };
  } catch (e) {}
  return response;
};

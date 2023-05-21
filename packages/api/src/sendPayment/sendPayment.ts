import {
  GEM_WALLET,
  PaymentRequestPayload,
  RequestPaymentMessage,
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
    const message: RequestPaymentMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SEND_PAYMENT/V3',
      payload: paymentPayload
    };
    return await sendMessageToContentScript(message);
  } catch (e) {}
  return response;
};

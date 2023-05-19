import {
  GEM_WALLET,
  PaymentResponse,
  PaymentRequestPayload,
  RequestPaymentMessage
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const sendPayment = async (paymentPayload: PaymentRequestPayload) => {
  /* string: hash of the transaction
   * null: user refused the payment
   * undefined: something went wrong
   */
  let response:
    | {
        hash: string;
      }
    | null
    | undefined = undefined;
  try {
    const message: RequestPaymentMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SEND_PAYMENT/V3',
      payload: paymentPayload
    };
    const { payment }: PaymentResponse = await sendMessageToContentScript(message);
    response = payment;
  } catch (e) {}
  return response;
};

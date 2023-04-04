import {
  GEM_WALLET,
  PaymentResponse,
  PaymentRequestPayload,
  RequestPaymentMessage
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const sendPayment = async (payment: PaymentRequestPayload) => {
  /* string: hash of the transaction
   * null: user refused the payment
   * undefined: something went wrong
   */
  let response: string | null | undefined = undefined;
  try {
    const message: RequestPaymentMessage = {
      app: GEM_WALLET,
      type: 'SEND_PAYMENT',
      payload: payment
    };
    const { hash }: PaymentResponse = await sendMessageToContentScript(message);
    response = hash;
  } catch (e) {}
  return response;
};

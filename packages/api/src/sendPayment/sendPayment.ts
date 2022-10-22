import {
  GEM_WALLET,
  Message,
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
      type: Message.SendPayment,
      payload: payment
    };
    const { hash }: PaymentResponse = await sendMessageToContentScript(message);
    response = hash;
  } catch (error) {
    throw error;
  }
  return response;
};

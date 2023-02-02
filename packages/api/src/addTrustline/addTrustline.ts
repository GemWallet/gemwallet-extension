import {
  GEM_WALLET,
  Message,
  PaymentResponse,
  TrustlineRequestPayload,
  RequestTrustlineMessage
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const addTrustline = async (payment: TrustlineRequestPayload) => {
  /* string: hash of the transaction
   * null: user refused the payment
   * undefined: something went wrong
   */
  let response: string | null | undefined = undefined;
  try {
    const message: RequestTrustlineMessage = {
      app: GEM_WALLET,
      type: Message.RequestAddTrustline,
      payload: payment
    };
    const { hash }: PaymentResponse = await sendMessageToContentScript(message);
    response = hash;
  } catch (e) {}
  return response;
};

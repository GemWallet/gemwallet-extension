import {
  GEM_WALLET,
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
      type: 'REQUEST_ADD_TRUSTLINE',
      payload: payment
    };
    const { hash }: PaymentResponse = await sendMessageToContentScript(message);
    response = hash;
  } catch (e) {}
  return response;
};

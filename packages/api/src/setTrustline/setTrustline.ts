import {
  GEM_WALLET,
  PaymentResponse,
  TrustlineRequestPayload,
  RequestTrustlineMessage
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const setTrustline = async (payment: TrustlineRequestPayload) => {
  /* string: hash of the transaction
   * null: user refused the payment
   * undefined: something went wrong
   */
  let response: string | null | undefined = undefined;
  try {
    const message: RequestTrustlineMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SET_TRUSTLINE',
      payload: payment
    };
    const { hash }: PaymentResponse = await sendMessageToContentScript(message);
    response = hash;
  } catch (e) {}
  return response;
};

/**
 * @deprecated Use setTrustline instead
 */
export const addTrustline = async (payment: TrustlineRequestPayload) => {
  return setTrustline(payment);
};

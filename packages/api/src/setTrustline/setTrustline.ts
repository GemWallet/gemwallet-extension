import {
  GEM_WALLET,
  PaymentResponse,
  RequestSetTrustlineMessage,
  SetTrustlineRequestPayload
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const setTrustline = async (payment: SetTrustlineRequestPayload) => {
  /* string: hash of the transaction
   * null: user refused the payment
   * undefined: something went wrong
   */
  let response: string | null | undefined = undefined;
  try {
    const message: RequestSetTrustlineMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SET_TRUSTLINE/V3',
      payload: payment
    };
    const { hash }: PaymentResponse = await sendMessageToContentScript(message);
    response = hash;
  } catch (e) {}
  return response;
};

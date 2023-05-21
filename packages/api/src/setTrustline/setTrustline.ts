import {
  GEM_WALLET,
  RequestSetTrustlineMessage,
  SetTrustlineRequestPayload,
  SetTrustlineResponse
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const setTrustline = async (trustlinePayload: SetTrustlineRequestPayload) => {
  /* string: hash of the transaction
   * null: user refused the payment
   * undefined: something went wrong
   */
  let response: SetTrustlineResponse | null | undefined = undefined;
  try {
    const message: RequestSetTrustlineMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SET_TRUSTLINE/V3',
      payload: trustlinePayload
    };
    return await sendMessageToContentScript(message);
  } catch (e) {}
  return response;
};

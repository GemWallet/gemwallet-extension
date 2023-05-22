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
    const response = await sendMessageToContentScript(message);
    return {
      result: response.result
    };
  } catch (e) {}
  return response;
};

import {
  GEM_WALLET,
  RequestSetTrustlineMessage,
  SetTrustlineRequest,
  SetTrustlineResponse
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const setTrustline = async (payload: SetTrustlineRequest): Promise<SetTrustlineResponse> => {
  /* string: hash of the transaction
   * null: user refused the payment
   * undefined: something went wrong
   */
  let response: SetTrustlineResponse = { result: undefined };
  try {
    const message: RequestSetTrustlineMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SET_TRUSTLINE/V3',
      payload
    };
    const response = await sendMessageToContentScript(message);
    return {
      result: response.result
    };
  } catch (e) {}
  return response;
};

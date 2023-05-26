import {
  GEM_WALLET,
  GetNetworkResponsePayload,
  RequestGetNetworkMessage
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const getNetwork = async (): Promise<GetNetworkResponsePayload> => {
  /* string: network
   * undefined: something went wrong
   */
  let response: GetNetworkResponsePayload = { result: undefined };
  try {
    const message: RequestGetNetworkMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_GET_NETWORK/V3'
    };
    const { result } = await sendMessageToContentScript(message);
    response.result = result;
  } catch (e) {
    throw e;
  }

  return response;
};

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
  try {
    const message: RequestGetNetworkMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_GET_NETWORK/V3'
    };
    const receivedMessage = await sendMessageToContentScript(message);
    if (!receivedMessage?.result) {
      return receivedMessage;
    }
    const { network } = receivedMessage?.result;
    return {
      result: { network }
    };
  } catch (e) {
    throw e;
  }
};

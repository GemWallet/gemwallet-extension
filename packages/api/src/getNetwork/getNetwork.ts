import { GEM_WALLET, RequestGetNetworkMessage } from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const getNetwork = async () => {
  /* string: network
   * undefined: something went wrong
   */
  try {
    const message: RequestGetNetworkMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_GET_NETWORK/V3'
    };
    const { network } = await sendMessageToContentScript(message);
    return {
      network
    };
  } catch (e) {
    throw e;
  }
};

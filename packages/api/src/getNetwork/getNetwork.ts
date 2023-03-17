import { GEM_WALLET, NetworkResponse, RequestNetworkMessage } from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const getNetwork = async () => {
  /* string: network
   * undefined: something went wrong
   */
  let response: NetworkResponse | undefined = undefined;
  try {
    const message: RequestNetworkMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_NETWORK'
    };
    const { network } = await sendMessageToContentScript(message);
    response = network;
  } catch (e) {
    throw e;
  }

  return response;
};

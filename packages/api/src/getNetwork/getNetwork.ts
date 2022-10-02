import { GEM_WALLET, GetNetworkMessage, Message, NetworkResponse } from '@gemwallet/constants';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const getNetwork = async () => {
  /* string: network
   * undefined: something went wrong
   */
  let response: NetworkResponse | undefined = undefined;
  try {
    const message: GetNetworkMessage = {
      app: GEM_WALLET,
      type: Message.RequestNetwork
    };
    const { network } = await sendMessageToContentScript(message);
    response = network;
  } catch (e) {
    throw e;
  }

  return response;
};

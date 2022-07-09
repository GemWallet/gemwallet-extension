import { GEM_WALLET, REQUEST_NETWORK } from '../constants/message';
import { MessageListenerEvent, NetworkResponse } from '../constants/message.types';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const getNetwork = async () => {
  let response: NetworkResponse = { network: null, error: '' };
  try {
    const message: MessageListenerEvent = {
      app: GEM_WALLET,
      type: REQUEST_NETWORK
    };
    response = await sendMessageToContentScript(message);
  } catch (e) {
    console.error(e);
  }

  const { network, error } = response;

  if (error) {
    throw error;
  }
  return network;
};

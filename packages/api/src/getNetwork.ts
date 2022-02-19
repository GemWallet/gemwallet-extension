import { GEM_WALLET, REQUEST_NETWORK } from '@gemwallet/constants/src/message';
import { MessageListenerEvent, NetworkResponse } from '@gemwallet/constants/src/message.types';
import { sendMessageToContentScript } from './helpers/extensionMessaging';

const getNetwork = async () => {
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

export = getNetwork;

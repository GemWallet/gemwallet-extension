import {
  GEM_WALLET,
  Message,
  MessageListenerEvent,
  Network,
  NetworkResponse
} from '@gemwallet/constants';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const getNetwork = async () => {
  let response: NetworkResponse = { network: Network.Test, error: '' };
  try {
    const message: MessageListenerEvent = {
      app: GEM_WALLET,
      type: Message.RequestNetwork
    };
    response = await sendMessageToContentScript(message);
  } catch (e) {
    throw e;
  }

  const { network, error } = response;

  if (error) {
    throw new Error(error);
  }
  return network;
};

import { GEM_WALLET, REQUEST_TRANSACTION } from './constants/message';
import { MessageListenerEvent, TransactionResponse } from './constants/message.types';
import { sendMessageToContentScript } from './helpers/extensionMessaging';
import { Params } from './transactionRequest.types';

const transactionRequest = async (payload: Params) => {
  try {
    const message: MessageListenerEvent = {
      app: GEM_WALLET,
      type: REQUEST_TRANSACTION,
      payload
    };
    const response: TransactionResponse = await sendMessageToContentScript(message);

    const { hash, error } = response;

    if (error) {
      throw new Error(error);
    }
    return hash;
  } catch (error) {
    throw error;
  }
};

export = transactionRequest;

import { GEM_WALLET, REQUEST_TRANSACTION } from '@gemwallet/constants/src/message';
import { MessageListenerEvent, TransactionResponse } from '@gemwallet/constants/src/message.types';
import { sendMessageToContentScript } from './helpers/extensionMessaging';
import { Params } from './transactionRequest.types';

const transactionRequest = async (payload: Params) => {
  let response: TransactionResponse = { status: 'waiting', error: '' };

  try {
    const message: MessageListenerEvent = {
      app: GEM_WALLET,
      type: REQUEST_TRANSACTION,
      payload
    };
    response = await sendMessageToContentScript(message);
  } catch (e) {
    console.error(e);
  }

  const { status, error } = response;

  if (error) {
    throw error;
  }
  return status;
};

export = transactionRequest;

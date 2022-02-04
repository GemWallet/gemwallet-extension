import { GEM_WALLET, REQUEST_TRANSACTION } from '@gemwallet/constants/src/message';
import { MessageListenerEvent, TransactionResponse } from '@gemwallet/constants/src/message.types';
import { sendMessageToContentScript } from './helpers/extensionMessaging';

const transactionRequest = async () => {
  let response: TransactionResponse = { status: 'waiting', error: '' };
  const payload = {
    chain: 'xrp',
    network: 'test',
    transaction: 'payment',
    amount: '50',
    destination: 'rNvFCZXpDtGeQ3bVas95wGLN6N2stGmA9o',
    token: 'xrp',
    apiVersion: 1
  };

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

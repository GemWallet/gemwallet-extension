import { GEM_WALLET, REQUEST_TRANSACTION } from '../constants/message';
import { MessageListenerEvent, TransactionResponse } from '../constants/message.types';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { Payment } from './transactionRequest.types';

export const transactionRequest = async (payment: Payment) => {
  try {
    const message: MessageListenerEvent = {
      app: GEM_WALLET,
      type: REQUEST_TRANSACTION,
      payload: payment
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

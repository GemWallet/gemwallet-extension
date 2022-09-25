import {
  GEM_WALLET,
  Message,
  MessageListenerEvent,
  PaymentResponse,
  Payment
} from '@gemwallet/constants';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const sendPayment = async (payment: Payment) => {
  try {
    const message: MessageListenerEvent = {
      app: GEM_WALLET,
      type: Message.SendPayment,
      payload: payment
    };
    const response: PaymentResponse = await sendMessageToContentScript(message);

    const { hash, error } = response;

    if (error) {
      throw new Error(error);
    }
    return hash;
  } catch (error) {
    throw error;
  }
};

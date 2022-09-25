import { GEM_WALLET } from '../global/global.constant';
import { Message } from '../message/message.constant';
import { Network } from '../network/network.constant';

export type MessageListenerEvent = {
  app: typeof GEM_WALLET;
  type: Message;
  payload?: { [key: string]: any };
};

export type EventListenerEvent = {
  data: MessageListenerEvent;
};

/*
 * Responses
 */

export type MessagingResponse = {
  source?: Message.MsgResponse;
  messagedId?: number;
};

export type NetworkResponse = MessagingResponse & {
  network: Network;
  error: string;
};

export type PublicAddressResponse = MessagingResponse & {
  publicAddress: string;
};

export type PublicKeyResponse = MessagingResponse & {
  address: string;
  publicKey: string;
};

export type SignedMessageResponse = MessagingResponse & {
  signedMessage: string | null;
};

export type IsConnectedResponse = MessagingResponse & {
  isConnected: boolean;
};

export interface PaymentResponseHash {
  hash: string;
  error: never;
}

export interface PaymentResponseError {
  hash: never;
  error: string;
}

export type PaymentResponse =
  | (MessagingResponse & PaymentResponseHash)
  | (MessagingResponse & PaymentResponseError);

import { Network } from './network.types';

export enum Message {
  RequestNetwork = 'REQUEST_NETWORK',
  RequestPublicKey = 'REQUEST_PUBLIC_KEY',
  RequestConnection = 'REQUEST_CONNECTION',
  ReceivePaymentHash = 'RECEIVE_PAYMENT_HASH',
  ReceivePublicKey = 'RECEIVE_PUBLIC_KEY',
  SendPayment = 'SEND_PAYMENT',
  MsgRequest = 'GEM_WALLET_MSG_REQUEST',
  MsgResponse = 'GEM_WALLET_MSG_RESPONSE'
}

export const GEM_WALLET = 'gem-wallet';

export type MessageListenerEvent = {
  app: 'gem-wallet';
  type: Message;
  payload?: { [key: string]: any };
};

export type EventListenerEvent = {
  data: MessageListenerEvent;
};

export type MessagingResponse = {
  source?: Message.MsgResponse;
  messagedId?: number;
};

export type NetworkResponse = MessagingResponse & {
  network: Network;
  error: string;
};

export type PublicKeyResponse = MessagingResponse & {
  publicKey: string;
};

export type IsConnectedResponse = MessagingResponse & {
  isConnected: boolean;
};

import { Network } from './network.types';

export enum Message {
  RequestNetwork = 'REQUEST_NETWORK',
  RequestAddress = 'REQUEST_ADDRESS',
  RequestConnection = 'REQUEST_CONNECTION',
  RequestSignMessage = 'REQUEST_SIGN_MESSAGE',
  ReceivePaymentHash = 'RECEIVE_PAYMENT_HASH',
  ReceiveAddress = 'RECEIVE_ADDRESS',
  ReceiveSignMessage = 'RECEIVE_SIGN_MESSAGE',
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

export type PublicAddressResponse = MessagingResponse & {
  publicAddress: string;
};

export type SignedMessageResponse = MessagingResponse & {
  signedMessage: string | null;
};

export type IsConnectedResponse = MessagingResponse & {
  isConnected: boolean;
};

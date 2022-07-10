import { Network } from './network.types';

type MessageApp = 'gem-wallet';

type MessageTypes =
  | 'REQUEST_NETWORK'
  | 'REQUEST_CONNECTION'
  | 'SEND_PAYMENT'
  | 'RECEIVE_PAYMENT_HASH';

export type MessageListenerEvent = {
  app: MessageApp;
  type: MessageTypes;
  payload?: { [key: string]: any };
};

export type EventListenerEvent = {
  data: MessageListenerEvent;
};

export type MessagingResponse = {
  source?: 'GEM_WALLET_MSG_RESPONSE';
  messagedId?: number;
};

export type NetworkResponse = MessagingResponse & {
  network: Network;
  error: string;
};

export type IsConnectedResponse = MessagingResponse & {
  isConnected: boolean;
};

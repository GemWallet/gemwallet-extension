import { Network } from './network.types';
import { TransactionStatus } from './transaction.types';

type MessageApp = 'gem-wallet';

type MessageTypes =
  | 'REQUEST_NETWORK'
  | 'REQUEST_CONNECTION'
  | 'REQUEST_TRANSACTION'
  | 'REQUEST_TRANSACTION_STATUS';

export type MessageListenerEvent = {
  app: MessageApp;
  type: MessageTypes;
};

export type EventListenerEvent = {
  data: MessageListenerEvent;
};

type MessagingResponse = {
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

export type TransactionResponse = MessagingResponse & {
  status: TransactionStatus;
  error: string;
};

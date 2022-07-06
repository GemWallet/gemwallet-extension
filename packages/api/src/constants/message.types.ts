import { Network } from './network.types';

type MessageApp = 'gem-wallet';

type MessageTypes =
  | 'REQUEST_NETWORK'
  | 'REQUEST_CONNECTION'
  | 'REQUEST_TRANSACTION'
  | 'REQUEST_TRANSACTION_STATUS';

export type MessageListenerEvent = {
  app: MessageApp;
  type: MessageTypes;
  payload?: { [key: string]: any };
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

export interface TransactionResponseHash {
  hash: string;
  error: never;
}

export interface TransactionResponseError {
  hash: never;
  error: string;
}

export type TransactionResponse =
  | (MessagingResponse & TransactionResponseHash)
  | (MessagingResponse & TransactionResponseError);

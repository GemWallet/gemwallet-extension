type MessageApp = 'gem-wallet';

type MessageTypes = 'REQUEST_NETWORK' | 'REQUEST_CONNECTION';

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
  network: null | 'TEST' | 'MAIN';
  error: string;
};

export type IsConnectedResponse = MessagingResponse & {
  isConnected: boolean;
};

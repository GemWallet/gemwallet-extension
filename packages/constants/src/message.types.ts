type MessageApp = 'gem-wallet';

type MessageTypes = 'REQUEST_NETWORK';

export type MessageListenerEvent = {
  app: MessageApp;
  type: MessageTypes;
  payload?: { [key: string]: any };
};

export type EventListenerEvent = {
  data: MessageListenerEvent;
};

export type NetworkResponse = {
  source?: 'GEM_WALLET_MSG_RESPONSE';
  messagedId?: number;
  network: null | 'TEST' | 'MAIN';
  error: string;
};

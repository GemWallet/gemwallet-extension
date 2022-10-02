import { Payment } from '../payment/payment.types';
import { GEM_WALLET } from '../global/global.constant';
import { Message } from '../message/message.constant';
import { Network } from '../network/network.constant';

// Event listeners
interface MessageEventData {
  app: typeof GEM_WALLET;
  type: Message;
  // TODO: Source and MessageID are used after the sendMessageToContentScript but not by the APIs
  source: Message;
  messageId: number;
  // Not all the MessageEventData have a payload
  payload?: any;
}

export interface NetworkEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: Message.RequestNetwork;
    source: Message.MsgRequest;
    messageId: number;
  };
}

export interface AddressEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: Message.RequestAddress;
    source: Message.MsgRequest;
    messageId: number;
    payload: {
      url: string;
      title: string;
      favicon: string | null | undefined;
    };
  };
}

export interface PublicKeyEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: Message.RequestPublicKey;
    source: Message.MsgRequest;
    messageId: number;
    payload: {
      url: string;
      title: string;
      favicon: string | null | undefined;
    };
  };
}

export interface SignMessageListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: Message.RequestSignMessage;
    source: Message.MsgRequest;
    messageId: number;
    payload: {
      url: string;
      title: string;
      favicon: string | null | undefined;
      message: string;
    };
  };
}

export interface PaymentEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: Message.SendPayment;
    source: Message.MsgRequest;
    messageId: number;
    payload: Payment;
  };
}

export type EventListener =
  | NetworkEventListener
  | AddressEventListener
  | PublicKeyEventListener
  | PaymentEventListener
  | SignMessageListener;

// Messages
export interface RequestNetworkMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestNetwork;
}

export interface RequestAddressMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestAddress;
  payload: {
    id: string;
    publicAddress: string | null;
  };
}

export interface RequestPublicKeyMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestPublicKey;
  payload: {
    id: string;
    address: string | null;
    publicKey: string | null;
  };
}

export interface SendPaymentMessage {
  app: typeof GEM_WALLET;
  type: Message.SendPayment;
  //TODO: Is this Payment really useful?
  payload: Payment;
}

export interface RequestSignMessageMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestSignMessage;
  payload: {
    url: string;
    title: string;
    favicon: string | null | undefined;
    message: string;
  };
}

export interface ReceivePaymentHashMessage {
  app: typeof GEM_WALLET;
  type: Message.ReceivePaymentHash;
  payload: {
    hash: string | null;
    //TODO: Make sure where this is imported as it is removed from background to content
    id?: number;
  };
}

export interface ReceiveAddressMessage {
  app: typeof GEM_WALLET;
  type: Message.ReceiveAddress;
  payload: {
    //TODO: Make sure where this is imported as it is removed from background to content
    id?: number;
    publicAddress: string;
  };
}
export interface ReceivePublicKeyMessage {
  app: typeof GEM_WALLET;
  type: Message.ReceivePublicKey;
  payload: {
    //TODO: Make sure where this is imported as it is removed from background to content
    id?: number;
    address: string;
    publicKey: string;
  };
}
export interface ReceiveSignMessageMessage {
  app: typeof GEM_WALLET;
  type: Message.ReceiveSignMessage;
  payload: {
    //TODO: Make sure where this is imported as it is removed from background to content
    id?: number;
    signedMessage: string;
  };
}

export type EventListenerMessage =
  | RequestNetworkMessage
  | RequestAddressMessage
  | RequestPublicKeyMessage
  | SendPaymentMessage
  | RequestSignMessageMessage
  | ReceivePaymentHashMessage
  | ReceiveAddressMessage
  | ReceivePublicKeyMessage
  | ReceiveSignMessageMessage;

//TODO: Are responses similar then massages above?
/*
 * Responses
 */
export type MessagingResponse = {
  source?: Message.MsgResponse;
  messagedId?: number;
};

export type NetworkResponse = MessagingResponse & {
  network: Network;
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

export type PaymentResponse = MessagingResponse & {
  hash: string | null;
};

// API Messages
export interface GetAddressMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestAddress;
  payload: {
    url: string;
    title: string;
    favicon: string | null | undefined;
  };
}

export interface GetNetworkMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestNetwork;
}

export interface GetPublicKeyMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestPublicKey;
  payload: {
    url: string;
    title: string;
    favicon: string | null | undefined;
  };
}

export interface IsConnectedMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestConnection;
}

export interface SignMessageMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestSignMessage;
  payload: {
    url: string;
    title: string;
    favicon: string | null | undefined;
    message: string;
  };
}

export type APIMessages =
  | GetAddressMessage
  | GetNetworkMessage
  | GetPublicKeyMessage
  | IsConnectedMessage
  | SendPaymentMessage
  | SignMessageMessage;

import { Payment } from '../payment/payment.types';
import { GEM_WALLET } from '../global/global.constant';
import { Message } from '../message/message.constant';
import { Network } from '../network/network.constant';

// Messages
export interface RequestNetworkMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestNetwork;
}

export interface RequestAddressMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestAddress;
  payload: {
    url: string;
    title: string;
    favicon: string | null | undefined;
  };
}

export interface RequestPublicKeyMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestPublicKey;
  payload: {
    url: string;
    title: string;
    favicon: string | null | undefined;
  };
}

export interface RequestPaymentMessage {
  app: typeof GEM_WALLET;
  type: Message.SendPayment;
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

export interface ReceivePaymentHashContentMessage {
  app: typeof GEM_WALLET;
  type: Message.ReceivePaymentHash;
  payload: {
    hash: string | null;
  };
}

export interface ReceiveAddressContentMessage {
  app: typeof GEM_WALLET;
  type: Message.ReceiveAddress;
  payload: {
    publicAddress: string;
  };
}
export interface ReceivePublicKeyContentMessage {
  app: typeof GEM_WALLET;
  type: Message.ReceivePublicKey;
  payload: {
    address: string | undefined | null;
    publicKey: string | undefined | null;
  };
}
export interface ReceiveSignMessageContentMessage {
  app: typeof GEM_WALLET;
  type: Message.ReceiveSignMessage;
  payload: {
    signedMessage: string;
  };
}

// Background Script Messages
type BackgroundMessagePayload = {
  payload: {
    id: number;
  };
};

export type ReceivePaymentHashBackgroundMessage = ReceivePaymentHashContentMessage &
  BackgroundMessagePayload;

export type ReceiveAddressBackgroundMessage = ReceiveAddressContentMessage &
  BackgroundMessagePayload;

export type ReceivePublicKeyBackgroundMessage = ReceivePublicKeyContentMessage &
  BackgroundMessagePayload;

export type ReceiveSignMessageBackgroundMessage = ReceiveSignMessageContentMessage &
  BackgroundMessagePayload;

export type BackgroundMessage =
  // Inputted messages - DO NOT contain ID within the payloads
  | RequestNetworkMessage
  | RequestAddressMessage
  | RequestPublicKeyMessage
  | RequestPaymentMessage
  | RequestSignMessageMessage
  // Outputted Messages - DO contain ID within the payloads
  | ReceivePaymentHashBackgroundMessage
  | ReceiveAddressBackgroundMessage
  | ReceivePublicKeyBackgroundMessage
  | ReceiveSignMessageBackgroundMessage;

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
export interface RequestIsConnectedMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestConnection;
}

export type APIMessages =
  | RequestAddressMessage
  | RequestNetworkMessage
  | RequestPublicKeyMessage
  | RequestIsConnectedMessage
  | RequestPaymentMessage
  | RequestSignMessageMessage;

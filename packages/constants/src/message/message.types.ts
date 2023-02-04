import { GEM_WALLET } from '../global/global.constant';
import { Message } from '../message/message.constant';
import {
  AddressResponsePayload,
  IsConnectedResponsePayload,
  NetworkResponsePayload,
  PaymentHashResponsePayload,
  PaymentRequestPayload,
  TrustlineRequestPayload,
  PublicKeyResponsePayload,
  SignedMessageResponsePayload,
  SignMessageRequestPayload,
  WebsiteRequestPayload,
  TrustlineHashResponsePayload
} from '../payload/payload.types';

/*
 * Requests
 */
export interface RequestNetworkMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestNetwork;
}

export interface RequestAddressMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestAddress;
  payload: WebsiteRequestPayload;
}

export interface RequestPublicKeyMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestPublicKey;
  payload: WebsiteRequestPayload;
}

export interface RequestPaymentMessage {
  app: typeof GEM_WALLET;
  type: Message.SendPayment;
  payload: PaymentRequestPayload;
}

export interface RequestTrustlineMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestAddTrustline;
  payload: TrustlineRequestPayload;
}

export interface RequestSignMessageMessage {
  app: typeof GEM_WALLET;
  type: Message.RequestSignMessage;
  payload: SignMessageRequestPayload;
}

/*
 * Responses
 */
export type MessagingResponse = {
  source?: Message.MsgResponse;
  messagedId?: number;
};
export type NetworkResponse = MessagingResponse & NetworkResponsePayload;
export type PublicAddressResponse = MessagingResponse & AddressResponsePayload;
export type PublicKeyResponse = MessagingResponse & PublicKeyResponsePayload;
export type SignedMessageResponse = MessagingResponse & SignedMessageResponsePayload;
export type IsConnectedResponse = MessagingResponse & IsConnectedResponsePayload;
export type PaymentResponse = MessagingResponse & PaymentHashResponsePayload;
export type TrustlineResponse = MessagingResponse & TrustlineHashResponsePayload;

// Content Script Messages
export interface ReceivePaymentHashContentMessage {
  app: typeof GEM_WALLET;
  type: Message.ReceivePaymentHash;
  payload: PaymentHashResponsePayload;
}
export interface ReceiveTrustlineHashContentMessage {
  app: typeof GEM_WALLET;
  type: Message.ReceiveTrustlineHash;
  payload: TrustlineHashResponsePayload;
}
export interface ReceiveAddressContentMessage {
  app: typeof GEM_WALLET;
  type: Message.ReceiveAddress;
  payload: AddressResponsePayload;
}
export interface ReceiveNetworkContentMessage {
  app: typeof GEM_WALLET;
  type: Message.ReceiveNetwork;
  payload: NetworkResponsePayload;
}
export interface ReceivePublicKeyContentMessage {
  app: typeof GEM_WALLET;
  type: Message.ReceivePublicKey;
  payload: PublicKeyResponsePayload;
}
export interface ReceiveSignMessageContentMessage {
  app: typeof GEM_WALLET;
  type: Message.ReceiveSignMessage;
  payload: SignedMessageResponsePayload;
}

// Background Script Messages
type BackgroundMessagePayload = {
  payload: {
    id: number;
  };
};

export type ReceivePaymentHashBackgroundMessage = ReceivePaymentHashContentMessage &
  BackgroundMessagePayload;

export type ReceiveTrustlineHashBackgroundMessage = ReceiveTrustlineHashContentMessage &
  BackgroundMessagePayload;

export type ReceiveAddressBackgroundMessage = ReceiveAddressContentMessage &
  BackgroundMessagePayload;

export type ReceiveNetworkBackgroundMessage = ReceiveNetworkContentMessage &
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
  | RequestTrustlineMessage
  | RequestSignMessageMessage
  // Outputted Messages - DO contain ID within the payloads
  | ReceivePaymentHashBackgroundMessage
  | ReceiveTrustlineHashBackgroundMessage
  | ReceiveAddressBackgroundMessage
  | ReceiveNetworkBackgroundMessage
  | ReceivePublicKeyBackgroundMessage
  | ReceiveSignMessageBackgroundMessage;

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
  | RequestTrustlineMessage
  | RequestSignMessageMessage;

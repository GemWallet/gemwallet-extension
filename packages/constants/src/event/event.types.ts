import { GEM_WALLET } from '../global/global.constant';
import { Message } from '../message/message.constant';
import {
  PaymentRequestPayload,
  TrustlineRequestPayload,
  SignMessageRequestPayload,
  WebsiteRequestPayload
} from '../payload/payload.types';

// Event listeners
interface MessageEventData {
  app: typeof GEM_WALLET;
  type: Message;
  source: Message.MsgRequest;
  messageId: number;
  // Not all the MessageEventData have a payload
  payload?:
    | WebsiteRequestPayload
    | PaymentRequestPayload
    | TrustlineRequestPayload
    | SignMessageRequestPayload;
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
    payload: WebsiteRequestPayload;
  };
}

export interface PublicKeyEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: Message.RequestPublicKey;
    source: Message.MsgRequest;
    messageId: number;
    payload: WebsiteRequestPayload;
  };
}

export interface SignMessageListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: Message.RequestSignMessage;
    source: Message.MsgRequest;
    messageId: number;
    payload: SignMessageRequestPayload;
  };
}

export interface PaymentEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: Message.SendPayment;
    source: Message.MsgRequest;
    messageId: number;
    payload: PaymentRequestPayload;
  };
}

export interface AddTrustlineEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: Message.RequestAddTrustline;
    source: Message.MsgRequest;
    messageId: number;
    payload: TrustlineRequestPayload;
  };
}

export type EventListener =
  | NetworkEventListener
  | AddressEventListener
  | PublicKeyEventListener
  | PaymentEventListener
  | AddTrustlineEventListener
  | SignMessageListener;

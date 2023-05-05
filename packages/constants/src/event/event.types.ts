import { GEM_WALLET } from '../global/global.constant';
import { RequestMessage } from '../message/message.types';
import {
  PaymentRequestPayload,
  TrustlineRequestPayload,
  SignMessageRequestPayload,
  WebsiteRequestPayload
} from '../payload/payload.types';

// Event listeners
interface MessageEventData {
  app: typeof GEM_WALLET;
  type: RequestMessage;
  source: 'GEM_WALLET_MSG_REQUEST';
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
    type: 'REQUEST_NETWORK';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
  };
}

export interface AddressEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_ADDRESS';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: WebsiteRequestPayload;
  };
}

export interface PublicKeyEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_PUBLIC_KEY';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: WebsiteRequestPayload;
  };
}

export interface NFTEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_NFT';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: WebsiteRequestPayload;
  };
}

export interface SignMessageListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_SIGN_MESSAGE';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: SignMessageRequestPayload;
  };
}

export interface PaymentEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'SEND_PAYMENT';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: PaymentRequestPayload;
  };
}

export interface SetTrustlineEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_SET_TRUSTLINE';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: TrustlineRequestPayload;
  };
}

export type EventListener =
  | NetworkEventListener
  | NFTEventListener
  | AddressEventListener
  | PublicKeyEventListener
  | PaymentEventListener
  | SetTrustlineEventListener
  | SignMessageListener;

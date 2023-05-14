import { GEM_WALLET } from '../global/global.constant';
import { RequestMessage } from '../message/message.types';
import {
  PaymentRequestPayload,
  PaymentRequestPayloadDeprecated,
  SetTrustlineRequestPayload,
  SetTrustlineRequestPayloadDeprecated,
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
    | PaymentRequestPayload
    | PaymentRequestPayloadDeprecated
    | SetTrustlineRequestPayload
    | SetTrustlineRequestPayloadDeprecated
    | SignMessageRequestPayload
    | WebsiteRequestPayload;
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

export interface GetNFTEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_GET_NFT/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: WebsiteRequestPayload;
  };
}

export interface GetNFTEventListenerDeprecated extends MessageEvent<MessageEventData> {
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
    type: 'SEND_PAYMENT/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: PaymentRequestPayload;
  };
}

export interface PaymentEventListenerDeprecated extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'SEND_PAYMENT';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: PaymentRequestPayloadDeprecated;
  };
}

export interface SetTrustlineEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_SET_TRUSTLINE/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: SetTrustlineRequestPayload;
  };
}

export interface SetTrustlineEventListenerDeprecated extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_ADD_TRUSTLINE';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: SetTrustlineRequestPayloadDeprecated;
  };
}

export type EventListener =
  | AddressEventListener
  | GetNFTEventListener
  | GetNFTEventListenerDeprecated
  | NetworkEventListener
  | PublicKeyEventListener
  | PaymentEventListener
  | PaymentEventListenerDeprecated
  | SetTrustlineEventListener
  | SetTrustlineEventListenerDeprecated
  | SignMessageListener;

import { GEM_WALLET } from '../global/global.constant';
import { EventMessage, RequestMessage } from '../message/message.types';
import {
  AcceptNFTOfferRequest,
  BurnNFTRequest,
  CancelNFTOfferRequest,
  CancelOfferRequest,
  CreateNFTOfferRequest,
  CreateOfferRequest,
  EventLoginResponse,
  EventLogoutResponse,
  EventNetworkChangedResponse,
  EventWalletChangedResponse,
  MintNFTRequest,
  SendPaymentRequest,
  SendPaymentRequestDeprecated,
  SetAccountRequest,
  SetTrustlineRequest,
  SetTrustlineRequestDeprecated,
  SignMessageRequest,
  SignTransactionRequest,
  SubmitTransactionRequest,
  WebsiteRequest
} from '../payload/payload.types';

// Event listeners
interface MessageEventData {
  app: typeof GEM_WALLET;
  type: RequestMessage;
  source: 'GEM_WALLET_MSG_REQUEST';
  messageId: number;
  // Not all the MessageEventData have a payload
  payload?:
    | AcceptNFTOfferRequest
    | BurnNFTRequest
    | CancelNFTOfferRequest
    | CancelOfferRequest
    | CreateNFTOfferRequest
    | CreateOfferRequest
    | MintNFTRequest
    | SendPaymentRequest
    | SendPaymentRequestDeprecated
    | SetAccountRequest
    | SetTrustlineRequest
    | SetTrustlineRequestDeprecated
    | SignMessageRequest
    | SubmitTransactionRequest
    | WebsiteRequest;
}

export interface NetworkEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_GET_NETWORK/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
  };
}

export interface NetworkEventListenerDeprecated extends MessageEvent<MessageEventData> {
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
    type: 'REQUEST_GET_ADDRESS/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: WebsiteRequest;
  };
}

export interface AddressEventListenerDeprecated extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_ADDRESS';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: WebsiteRequest;
  };
}

export interface PublicKeyEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_GET_PUBLIC_KEY/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: WebsiteRequest;
  };
}

export interface PublicKeyEventListenerDeprecated extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_PUBLIC_KEY';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: WebsiteRequest;
  };
}

export interface GetNFTEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_GET_NFT/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: WebsiteRequest;
  };
}

export interface GetNFTEventListenerDeprecated extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_NFT';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: WebsiteRequest;
  };
}

export interface SignMessageListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_SIGN_MESSAGE/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: SignMessageRequest;
  };
}

export interface SignMessageListenerDeprecated extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_SIGN_MESSAGE';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: SignMessageRequest;
  };
}

export interface PaymentEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_SEND_PAYMENT/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: SendPaymentRequest;
  };
}

export interface PaymentEventListenerDeprecated extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'SEND_PAYMENT';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: SendPaymentRequestDeprecated;
  };
}

export interface MintNFTEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_MINT_NFT/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: MintNFTRequest;
  };
}

export interface SetTrustlineEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_SET_TRUSTLINE/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: SetTrustlineRequest;
  };
}

export interface CreateNFTOfferEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_CREATE_NFT_OFFER/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: CreateNFTOfferRequest;
  };
}

export interface CancelNFTOfferEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_CANCEL_NFT_OFFER/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: CancelNFTOfferRequest;
  };
}

export interface AcceptNFTOfferEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_ACCEPT_NFT_OFFER/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: AcceptNFTOfferRequest;
  };
}

export interface BurnNFTEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_BURN_NFT/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: BurnNFTRequest;
  };
}

export interface SetTrustlineEventListenerDeprecated extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_ADD_TRUSTLINE';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: SetTrustlineRequestDeprecated;
  };
}

export interface SubmitTransactionEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_SUBMIT_TRANSACTION/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: SubmitTransactionRequest;
  };
}

export interface SignTransactionEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_SIGN_TRANSACTION/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: SignTransactionRequest;
  };
}

export interface SetAccountEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_SET_ACCOUNT/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: SetAccountRequest;
  };
}

export interface CreateOfferEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_CREATE_OFFER/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: CreateOfferRequest;
  };
}

export interface CancelOfferEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'REQUEST_CANCEL_OFFER/V3';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: CancelOfferRequest;
  };
}

export type EventListener =
  | AcceptNFTOfferEventListener
  | AddressEventListener
  | AddressEventListenerDeprecated
  | BurnNFTEventListener
  | CancelNFTOfferEventListener
  | CancelOfferEventListener
  | CreateNFTOfferEventListener
  | CreateOfferEventListener
  | GetNFTEventListener
  | GetNFTEventListenerDeprecated
  | MintNFTEventListener
  | NetworkEventListener
  | NetworkEventListenerDeprecated
  | PublicKeyEventListener
  | PublicKeyEventListenerDeprecated
  | PaymentEventListener
  | PaymentEventListenerDeprecated
  | SetAccountEventListener
  | SetTrustlineEventListener
  | SetTrustlineEventListenerDeprecated
  | SignMessageListener
  | SignMessageListenerDeprecated
  | SignTransactionEventListener
  | SubmitTransactionEventListener;

// Events
interface EventEventData {
  app: typeof GEM_WALLET;
  type: EventMessage;
  source: 'GEM_WALLET_MSG_REQUEST';
  messageId: number;
  payload?:
    | EventNetworkChangedResponse
    | EventWalletChangedResponse
    | EventLoginResponse
    | EventLogoutResponse;
}

export interface EventNetworkChangedEventListener extends MessageEvent<EventEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'EVENT_NETWORK_CHANGED';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: EventNetworkChangedResponse;
  };
}

export interface EventWalletChangedEventListener extends MessageEvent<EventEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'EVENT_WALLET_CHANGED';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: EventWalletChangedResponse;
  };
}

export interface EventLoginEventListener extends MessageEvent<EventEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'EVENT_LOGIN';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: EventLoginResponse;
  };
}

export interface EventLogoutEventListener extends MessageEvent<EventEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: 'EVENT_LOGOUT';
    source: 'GEM_WALLET_MSG_REQUEST';
    messageId: number;
    payload: EventLogoutResponse;
  };
}

export type EventEventListener =
  | EventNetworkChangedEventListener
  | EventWalletChangedEventListener
  | EventLoginEventListener
  | EventLogoutEventListener;

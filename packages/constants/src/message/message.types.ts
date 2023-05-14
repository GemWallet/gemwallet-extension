import { GEM_WALLET } from '../global/global.constant';
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
  TrustlineHashResponsePayload,
  GetNFTResponsePayload,
  GetNFTResponsePayloadDeprecated,
  NFTRequestPayload
} from '../payload/payload.types';

export type RequestMessage =
  | 'SEND_PAYMENT'
  | 'REQUEST_ADDRESS'
  | 'REQUEST_CONNECTION'
  | 'REQUEST_GET_NFT/V3'
  | 'REQUEST_NETWORK'
  | 'REQUEST_NFT'
  | 'REQUEST_PUBLIC_KEY'
  | 'REQUEST_SET_TRUSTLINE'
  | 'REQUEST_SIGN_MESSAGE';

export type ReceiveMessage =
  | 'RECEIVE_PAYMENT_HASH'
  | 'RECEIVE_ADDRESS'
  | 'RECEIVE_TRUSTLINE_HASH'
  | 'RECEIVE_NETWORK'
  | 'RECEIVE_GET_NFT/V3'
  | 'RECEIVE_NFT'
  | 'RECEIVE_PUBLIC_KEY'
  | 'RECEIVE_SIGN_MESSAGE';

export type SourceMessage = 'GEM_WALLET_MSG_REQUEST' | 'GEM_WALLET_MSG_RESPONSE';

/*
 * Requests
 */
export interface RequestNetworkMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_NETWORK';
}

export interface RequestAddressMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_ADDRESS';
  payload: WebsiteRequestPayload;
}

export interface RequestPublicKeyMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_PUBLIC_KEY';
  payload: WebsiteRequestPayload;
}

export interface RequestPaymentMessage {
  app: typeof GEM_WALLET;
  type: 'SEND_PAYMENT';
  payload: PaymentRequestPayload;
}

export interface RequestTrustlineMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SET_TRUSTLINE';
  payload: TrustlineRequestPayload;
}

export interface RequestGetNFTMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_GET_NFT/V3';
  payload: NFTRequestPayload & WebsiteRequestPayload;
}

export interface RequestGetNFTMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'REQUEST_NFT';
  payload: NFTRequestPayload & WebsiteRequestPayload;
}

export interface RequestSignMessageMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SIGN_MESSAGE';
  payload: SignMessageRequestPayload;
}

/*
 * Responses
 */
export type MessagingResponse = {
  source?: 'GEM_WALLET_MSG_RESPONSE';
  messagedId?: number;
};
export type NetworkResponse = MessagingResponse & NetworkResponsePayload;
export type NFTResponse = MessagingResponse & NFTRequestPayload;
export type PublicAddressResponse = MessagingResponse & AddressResponsePayload;
export type PublicKeyResponse = MessagingResponse & PublicKeyResponsePayload;
export type SignedMessageResponse = MessagingResponse & SignedMessageResponsePayload;
export type IsConnectedResponse = MessagingResponse & IsConnectedResponsePayload;
export type PaymentResponse = MessagingResponse & PaymentHashResponsePayload;
export type TrustlineResponse = MessagingResponse & TrustlineHashResponsePayload;

// Content Script Messages
export interface ReceivePaymentHashContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_PAYMENT_HASH';
  payload: PaymentHashResponsePayload;
}
export interface ReceiveTrustlineHashContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_TRUSTLINE_HASH';
  payload: TrustlineHashResponsePayload;
}
export interface ReceiveAddressContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_ADDRESS';
  payload: AddressResponsePayload;
}
export interface ReceiveNetworkContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_NETWORK';
  payload: NetworkResponsePayload;
}

export interface ReceiveGetNFTContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_GET_NFT/V3';
  payload: GetNFTResponsePayload;
}

export interface ReceiveGetNFTContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_NFT';
  payload: GetNFTResponsePayloadDeprecated;
}

export interface ReceivePublicKeyContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_PUBLIC_KEY';
  payload: PublicKeyResponsePayload;
}
export interface ReceiveSignMessageContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SIGN_MESSAGE';
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

export type ReceiveGetNFTBackgroundMessage = ReceiveGetNFTContentMessage & BackgroundMessagePayload;

export type ReceiveGetNFTBackgroundMessageDeprecated = ReceiveGetNFTContentMessageDeprecated &
  BackgroundMessagePayload;

export type ReceivePublicKeyBackgroundMessage = ReceivePublicKeyContentMessage &
  BackgroundMessagePayload;

export type ReceiveSignMessageBackgroundMessage = ReceiveSignMessageContentMessage &
  BackgroundMessagePayload;

export type BackgroundMessage =
  // Inputted messages - DO NOT contain ID within the payloads
  | RequestNetworkMessage
  | RequestGetNFTMessage
  | RequestGetNFTMessageDeprecated
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
  | ReceiveGetNFTBackgroundMessage
  | ReceiveGetNFTBackgroundMessageDeprecated
  | ReceivePublicKeyBackgroundMessage
  | ReceiveSignMessageBackgroundMessage;

// API Messages
export interface RequestIsConnectedMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_CONNECTION';
}

export type APIMessages =
  | RequestAddressMessage
  | RequestNetworkMessage
  | RequestGetNFTMessage
  | RequestGetNFTMessageDeprecated
  | RequestPublicKeyMessage
  | RequestIsConnectedMessage
  | RequestPaymentMessage
  | RequestTrustlineMessage
  | RequestSignMessageMessage;

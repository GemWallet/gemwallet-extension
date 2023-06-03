import { GEM_WALLET } from '../global/global.constant';
import {
  GetAddressResponse,
  GetNFTResponse,
  GetNFTResponseDeprecated,
  IsConnectedResponse,
  GetNetworkResponse,
  GetNFTRequest,
  SendPaymentRequest,
  SendPaymentRequestDeprecated,
  GetPublicKeyResponse,
  SendPaymentResponse,
  SendPaymentResponseDeprecated,
  SetTrustlineResponse,
  SetTrustlineResponseDeprecated,
  SetTrustlineRequest,
  SetTrustlineRequestDeprecated,
  SignMessageResponse,
  SignMessageResponseDeprecated,
  SignMessageRequest,
  WebsiteRequest,
  GetAddressResponseDeprecated,
  GetNetworkResponseDeprecated,
  GetPublicKeyResponseDeprecated
} from '../payload/payload.types';

export type RequestMessage =
  | 'REQUEST_ADDRESS'
  | 'REQUEST_ADD_TRUSTLINE'
  | 'REQUEST_CONNECTION'
  | 'REQUEST_GET_ADDRESS/V3'
  | 'REQUEST_GET_NETWORK/V3'
  | 'REQUEST_GET_NFT/V3'
  | 'REQUEST_GET_PUBLIC_KEY/V3'
  | 'REQUEST_NETWORK'
  | 'REQUEST_NFT'
  | 'REQUEST_PUBLIC_KEY'
  | 'REQUEST_SEND_PAYMENT/V3'
  | 'REQUEST_SET_TRUSTLINE/V3'
  | 'REQUEST_SIGN_MESSAGE'
  | 'REQUEST_SIGN_MESSAGE/V3'
  | 'SEND_PAYMENT';

export type ReceiveMessage =
  | 'RECEIVE_ADDRESS'
  | 'RECEIVE_GET_ADDRESS/V3'
  | 'RECEIVE_GET_NFT/V3'
  | 'RECEIVE_GET_PUBLIC_KEY/V3'
  | 'RECEIVE_GET_NETWORK/V3'
  | 'RECEIVE_NETWORK'
  | 'RECEIVE_NFT'
  | 'RECEIVE_PAYMENT_HASH'
  | 'RECEIVE_TRUSTLINE_HASH'
  | 'RECEIVE_PUBLIC_KEY'
  | 'RECEIVE_SEND_PAYMENT/V3'
  | 'RECEIVE_SET_TRUSTLINE/V3'
  | 'RECEIVE_SIGN_MESSAGE'
  | 'RECEIVE_SIGN_MESSAGE/V3';

export type SourceMessage = 'GEM_WALLET_MSG_REQUEST' | 'GEM_WALLET_MSG_RESPONSE';

/*
 * Requests
 */
export interface RequestGetNetworkMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_GET_NETWORK/V3';
}

export interface RequestGetNetworkMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'REQUEST_NETWORK';
}

export interface RequestGetAddressMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_GET_ADDRESS/V3';
  payload: WebsiteRequest;
}

export interface RequestGetAddressMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'REQUEST_ADDRESS';
  payload: WebsiteRequest;
}

export interface RequestGetPublicKeyMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_GET_PUBLIC_KEY/V3';
  payload: WebsiteRequest;
}

export interface RequestGetPublicKeyMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'REQUEST_PUBLIC_KEY';
  payload: WebsiteRequest;
}

export interface RequestSendPaymentMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SEND_PAYMENT/V3';
  payload: SendPaymentRequest;
}

export interface RequestSendPaymentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'SEND_PAYMENT';
  payload: SendPaymentRequestDeprecated;
}

export interface RequestSetTrustlineMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SET_TRUSTLINE/V3';
  payload: SetTrustlineRequest;
}

export interface RequestSetTrustlineMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'REQUEST_ADD_TRUSTLINE';
  payload: SetTrustlineRequestDeprecated;
}

export interface RequestGetNFTMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_GET_NFT/V3';
  payload: GetNFTRequest & WebsiteRequest;
}

export interface RequestGetNFTMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'REQUEST_NFT';
  payload: GetNFTRequest & WebsiteRequest;
}

export interface RequestSignMessageMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SIGN_MESSAGE/V3';
  payload: SignMessageRequest;
}

export interface RequestSignMessageMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SIGN_MESSAGE';
  payload: SignMessageRequest;
}

/*
 * Responses
 */
export type MessagingResponse = {
  source?: 'GEM_WALLET_MSG_RESPONSE';
  messagedId?: number;
};

export type NetworkMessagingResponse = MessagingResponse & GetNetworkResponse;
export type NetworkMessagingResponseDeprecated = MessagingResponse & GetNetworkResponseDeprecated;
export type NFTMessagingResponse = MessagingResponse & GetNFTRequest;
export type PublicAddressMessagingResponse = MessagingResponse & GetAddressResponse;
export type PublicAddressMessagingResponseDeprecated = MessagingResponse &
  GetAddressResponseDeprecated;
export type PublicKeyMessagingResponse = MessagingResponse & GetPublicKeyResponse;
export type PublicKeyMessagingResponseDeprecated = MessagingResponse &
  GetPublicKeyResponseDeprecated;
export type SignMessageMessagingResponse = MessagingResponse & SignMessageResponse;
export type SignMessageMessagingResponseDeprecated = MessagingResponse &
  SignMessageResponseDeprecated;
export type IsConnectedMessagingResponse = MessagingResponse & IsConnectedResponse;
export type SendPaymentMessagingResponse = MessagingResponse & SendPaymentResponse;
export type SendPaymentMessagingResponseDeprecated = MessagingResponse &
  SendPaymentResponseDeprecated;
export type SetTrustlineMessagingResponse = MessagingResponse & SetTrustlineResponse;
export type SetTrustlineMessagingResponseDeprecated = MessagingResponse &
  SetTrustlineResponseDeprecated;

// Content Script Messages
export interface ReceiveSendPaymentContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SEND_PAYMENT/V3';
  payload: SendPaymentResponse;
}

export interface ReceiveSendPaymentContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_PAYMENT_HASH';
  payload: SendPaymentResponseDeprecated;
}

export interface ReceiveSetTrustlineContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SET_TRUSTLINE/V3';
  payload: SetTrustlineResponse;
}

export interface ReceiveSetTrustlineContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_TRUSTLINE_HASH';
  payload: SetTrustlineResponseDeprecated;
}

export interface ReceiveGetAddressContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_GET_ADDRESS/V3';
  payload: GetAddressResponse;
}

export interface ReceiveGetAddressContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_ADDRESS';
  payload: GetAddressResponseDeprecated;
}

export interface ReceiveGetNetworkContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_GET_NETWORK/V3';
  payload: GetNetworkResponse;
}

export interface ReceiveGetNetworkContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_NETWORK';
  payload: GetNetworkResponseDeprecated;
}

export interface ReceiveGetNFTContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_GET_NFT/V3';
  payload: GetNFTResponse;
}

export interface ReceiveGetNFTContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_NFT';
  payload: GetNFTResponseDeprecated;
}

export interface ReceiveGetPublicKeyContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_GET_PUBLIC_KEY/V3';
  payload: GetPublicKeyResponse;
}

export interface ReceiveGetPublicKeyContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_PUBLIC_KEY';
  payload: GetPublicKeyResponseDeprecated;
}

export interface ReceiveSignMessageContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SIGN_MESSAGE/V3';
  payload: SignMessageResponse;
}

export interface ReceiveSignMessageContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SIGN_MESSAGE';
  payload: SignMessageResponseDeprecated;
}

// Background Script Messages
type BackgroundMessagePayload = {
  payload: {
    id: number;
  };
};

export type ReceiveSendPaymentBackgroundMessage = ReceiveSendPaymentContentMessage &
  BackgroundMessagePayload;

export type ReceiveSendPaymentBackgroundMessageDeprecated =
  ReceiveSendPaymentContentMessageDeprecated & BackgroundMessagePayload;

export type ReceiveSetTrustlineBackgroundMessage = ReceiveSetTrustlineContentMessage &
  BackgroundMessagePayload;

export type ReceiveSetTrustlineBackgroundMessageDeprecated =
  ReceiveSetTrustlineContentMessageDeprecated & BackgroundMessagePayload;

export type ReceiveGetAddressBackgroundMessage = ReceiveGetAddressContentMessage &
  BackgroundMessagePayload;

export type ReceiveGetAddressBackgroundMessageDeprecated =
  ReceiveGetAddressContentMessageDeprecated & BackgroundMessagePayload;

export type ReceiveGetNetworkBackgroundMessage = ReceiveGetNetworkContentMessage &
  BackgroundMessagePayload;

export type ReceiveGetNetworkBackgroundMessageDeprecated =
  ReceiveGetNetworkContentMessageDeprecated & BackgroundMessagePayload;

export type ReceiveGetNFTBackgroundMessage = ReceiveGetNFTContentMessage & BackgroundMessagePayload;

export type ReceiveGetNFTBackgroundMessageDeprecated = ReceiveGetNFTContentMessageDeprecated &
  BackgroundMessagePayload;

export type ReceivePublicKeyBackgroundMessage = ReceiveGetPublicKeyContentMessage &
  BackgroundMessagePayload;

export type ReceivePublicKeyBackgroundMessageDeprecated =
  ReceiveGetPublicKeyContentMessageDeprecated & BackgroundMessagePayload;

export type ReceiveSignMessageBackgroundMessage = ReceiveSignMessageContentMessage &
  BackgroundMessagePayload;

export type ReceiveSignMessageBackgroundMessageDeprecated =
  ReceiveSignMessageContentMessageDeprecated & BackgroundMessagePayload;

export type BackgroundMessage =
  // Inputted messages - DO NOT contain ID within the payloads
  | RequestGetAddressMessage
  | RequestGetAddressMessageDeprecated
  | RequestGetNetworkMessage
  | RequestGetNetworkMessageDeprecated
  | RequestGetNFTMessage
  | RequestGetNFTMessageDeprecated
  | RequestGetPublicKeyMessage
  | RequestGetPublicKeyMessageDeprecated
  | RequestSendPaymentMessage
  | RequestSendPaymentMessageDeprecated
  | RequestSetTrustlineMessage
  | RequestSetTrustlineMessageDeprecated
  | RequestSignMessageMessage
  | RequestSignMessageMessageDeprecated
  // Outputted Messages - DO contain ID within the payloads
  | ReceiveGetAddressBackgroundMessage
  | ReceiveGetAddressBackgroundMessageDeprecated
  | ReceiveGetNetworkBackgroundMessage
  | ReceiveGetNetworkBackgroundMessageDeprecated
  | ReceiveGetNFTBackgroundMessage
  | ReceiveGetNFTBackgroundMessageDeprecated
  | ReceivePublicKeyBackgroundMessage
  | ReceivePublicKeyBackgroundMessageDeprecated
  | ReceiveSendPaymentBackgroundMessage
  | ReceiveSendPaymentBackgroundMessageDeprecated
  | ReceiveSetTrustlineBackgroundMessage
  | ReceiveSetTrustlineBackgroundMessageDeprecated
  | ReceiveSignMessageBackgroundMessage
  | ReceiveSignMessageBackgroundMessageDeprecated;

// API Messages
export interface RequestIsConnectedMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_CONNECTION';
}

export type APIMessages =
  | RequestGetAddressMessage
  | RequestGetNetworkMessage
  | RequestGetNFTMessage
  | RequestGetPublicKeyMessage
  | RequestIsConnectedMessage
  | RequestSendPaymentMessage
  | RequestSetTrustlineMessage
  | RequestSignMessageMessage;

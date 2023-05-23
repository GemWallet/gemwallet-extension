import { GEM_WALLET } from '../global/global.constant';
import {
  AddressResponsePayload,
  GetNFTResponsePayload,
  GetNFTResponsePayloadDeprecated,
  IsConnectedResponsePayload,
  NetworkResponsePayload,
  NFTRequestPayload,
  PaymentRequestPayload,
  PaymentRequestPayloadDeprecated,
  PublicKeyResponsePayload,
  SendPaymentResponse,
  SendPaymentResponseDeprecated,
  SetTrustlineResponse,
  SetTrustlineResponseDeprecated,
  SetTrustlineRequestPayload,
  SetTrustlineRequestPayloadDeprecated,
  SignedMessageResponsePayload,
  SignedMessageResponsePayloadDeprecated,
  SignMessageRequestPayload,
  WebsiteRequestPayload,
  AddressResponsePayloadDeprecated,
  NetworkResponsePayloadDeprecated,
  PublicKeyResponsePayloadDeprecated
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
  payload: WebsiteRequestPayload;
}

export interface RequestGetAddressMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'REQUEST_ADDRESS';
  payload: WebsiteRequestPayload;
}

export interface RequestGetPublicKeyMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_GET_PUBLIC_KEY/V3';
  payload: WebsiteRequestPayload;
}

export interface RequestGetPublicKeyMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'REQUEST_PUBLIC_KEY';
  payload: WebsiteRequestPayload;
}

export interface RequestSendPaymentMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SEND_PAYMENT/V3';
  payload: PaymentRequestPayload;
}

export interface RequestSendPaymentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'SEND_PAYMENT';
  payload: PaymentRequestPayloadDeprecated;
}

export interface RequestSetTrustlineMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SET_TRUSTLINE/V3';
  payload: SetTrustlineRequestPayload;
}

export interface RequestSetTrustlineMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'REQUEST_ADD_TRUSTLINE';
  payload: SetTrustlineRequestPayloadDeprecated;
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
  type: 'REQUEST_SIGN_MESSAGE/V3';
  payload: SignMessageRequestPayload;
}

export interface RequestSignMessageMessageDeprecated {
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
export type NetworkResponseDeprecated = MessagingResponse & NetworkResponsePayloadDeprecated;
export type NFTResponse = MessagingResponse & NFTRequestPayload;
export type PublicAddressResponse = MessagingResponse & AddressResponsePayload;
export type PublicAddressResponseDeprecated = MessagingResponse & AddressResponsePayloadDeprecated;
export type PublicKeyResponse = MessagingResponse & PublicKeyResponsePayload;
export type PublicKeyResponseDeprecated = MessagingResponse & PublicKeyResponsePayloadDeprecated;
export type SignedMessageResponse = MessagingResponse & SignedMessageResponsePayload;
export type SignedMessageResponseDeprecated = MessagingResponse &
  SignedMessageResponsePayloadDeprecated;
export type IsConnectedResponse = MessagingResponse & IsConnectedResponsePayload;
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

export interface ReceiveAddressContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_GET_ADDRESS/V3';
  payload: AddressResponsePayload;
}

export interface ReceiveAddressContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_ADDRESS';
  payload: AddressResponsePayloadDeprecated;
}

export interface ReceiveNetworkContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_GET_NETWORK/V3';
  payload: NetworkResponsePayload;
}

export interface ReceiveGetNetworkContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_NETWORK';
  payload: NetworkResponsePayloadDeprecated;
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
  type: 'RECEIVE_GET_PUBLIC_KEY/V3';
  payload: PublicKeyResponsePayload;
}

export interface ReceivePublicKeyContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_PUBLIC_KEY';
  payload: PublicKeyResponsePayloadDeprecated;
}

export interface ReceiveSignMessageContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SIGN_MESSAGE/V3';
  payload: SignedMessageResponsePayload;
}

export interface ReceiveSignMessageContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SIGN_MESSAGE';
  payload: SignedMessageResponsePayloadDeprecated;
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

export type ReceiveGetAddressBackgroundMessage = ReceiveAddressContentMessage &
  BackgroundMessagePayload;

export type ReceiveGetAddressBackgroundMessageDeprecated = ReceiveAddressContentMessageDeprecated &
  BackgroundMessagePayload;

export type ReceiveGetNetworkBackgroundMessage = ReceiveNetworkContentMessage &
  BackgroundMessagePayload;

export type ReceiveGetNetworkBackgroundMessageDeprecated =
  ReceiveGetNetworkContentMessageDeprecated & BackgroundMessagePayload;

export type ReceiveGetNFTBackgroundMessage = ReceiveGetNFTContentMessage & BackgroundMessagePayload;

export type ReceiveGetNFTBackgroundMessageDeprecated = ReceiveGetNFTContentMessageDeprecated &
  BackgroundMessagePayload;

export type ReceivePublicKeyBackgroundMessage = ReceivePublicKeyContentMessage &
  BackgroundMessagePayload;

export type ReceivePublicKeyBackgroundMessageDeprecated = ReceivePublicKeyContentMessageDeprecated &
  BackgroundMessagePayload;

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

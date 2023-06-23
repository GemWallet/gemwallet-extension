import { GEM_WALLET } from '../global/global.constant';
import {
  AcceptNFTOfferResponse,
  AcceptNFTOfferRequest,
  BurnNFTRequest,
  BurnNFTResponse,
  CancelNFTOfferRequest,
  CancelNFTOfferResponse,
  CreateNFTOfferRequest,
  CreateNFTOfferResponse,
  GetAddressResponse,
  GetAddressResponseDeprecated,
  GetNFTResponse,
  GetNFTResponseDeprecated,
  GetNetworkResponse,
  GetNetworkResponseDeprecated,
  GetNFTRequest,
  GetPublicKeyResponse,
  GetPublicKeyResponseDeprecated,
  IsInstalledResponse,
  MintNFTRequest,
  MintNFTResponse,
  SendPaymentRequest,
  SendPaymentRequestDeprecated,
  SendPaymentResponse,
  SendPaymentResponseDeprecated,
  SetAccountResponse,
  SetAccountRequest,
  SetTrustlineResponse,
  SetTrustlineResponseDeprecated,
  SetTrustlineRequest,
  SetTrustlineRequestDeprecated,
  SignMessageResponse,
  SignMessageResponseDeprecated,
  SignMessageRequest,
  WebsiteRequest
} from '../payload/payload.types';

export type RequestMessage =
  | 'REQUEST_ACCEPT_NFT_OFFER/V3'
  | 'REQUEST_ADDRESS'
  | 'REQUEST_ADD_TRUSTLINE'
  | 'REQUEST_BURN_NFT/V3'
  | 'REQUEST_CONNECTION'
  | 'REQUEST_CANCEL_NFT_OFFER/V3'
  | 'REQUEST_CREATE_NFT_OFFER/V3'
  | 'REQUEST_GET_ADDRESS/V3'
  | 'REQUEST_GET_NETWORK/V3'
  | 'REQUEST_GET_NFT/V3'
  | 'REQUEST_GET_PUBLIC_KEY/V3'
  | 'REQUEST_MINT_NFT/V3'
  | 'REQUEST_NETWORK'
  | 'REQUEST_NFT'
  | 'REQUEST_PUBLIC_KEY'
  | 'REQUEST_SEND_PAYMENT/V3'
  | 'REQUEST_SET_ACCOUNT/V3'
  | 'REQUEST_SET_TRUSTLINE/V3'
  | 'REQUEST_SIGN_MESSAGE'
  | 'REQUEST_SIGN_MESSAGE/V3'
  | 'SEND_PAYMENT';

export type ReceiveMessage =
  | 'RECEIVE_ACCEPT_NFT_OFFER/V3'
  | 'RECEIVE_ADDRESS'
  | 'RECEIVE_BURN_NFT/V3'
  | 'RECEIVE_CANCEL_NFT_OFFER/V3'
  | 'RECEIVE_CREATE_NFT_OFFER/V3'
  | 'RECEIVE_GET_ADDRESS/V3'
  | 'RECEIVE_GET_NFT/V3'
  | 'RECEIVE_GET_PUBLIC_KEY/V3'
  | 'RECEIVE_GET_NETWORK/V3'
  | 'RECEIVE_MINT_NFT/V3'
  | 'RECEIVE_NETWORK'
  | 'RECEIVE_NFT'
  | 'RECEIVE_PAYMENT_HASH'
  | 'RECEIVE_TRUSTLINE_HASH'
  | 'RECEIVE_PUBLIC_KEY'
  | 'RECEIVE_SEND_PAYMENT/V3'
  | 'RECEIVE_SET_ACCOUNT/V3'
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

export interface RequestMintNFTMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_MINT_NFT/V3';
  payload: MintNFTRequest;
}

export interface RequestCreateNFTOfferMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_CREATE_NFT_OFFER/V3';
  payload: CreateNFTOfferRequest;
}

export interface RequestCancelNFTOfferMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_CANCEL_NFT_OFFER/V3';
  payload: CancelNFTOfferRequest;
}

export interface RequestAcceptNFTOfferMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_ACCEPT_NFT_OFFER/V3';
  payload: AcceptNFTOfferRequest;
}

export interface RequestBurnNFTMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_BURN_NFT/V3';
  payload: BurnNFTRequest;
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

export interface RequestSetAccountMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SET_ACCOUNT/V3';
  payload: SetAccountRequest;
}

/*
 * Responses
 */
export type MessagingResponse = {
  source?: 'GEM_WALLET_MSG_RESPONSE';
  messagedId?: number;
  error?: MessagingError;
};

// Errors
export interface MessagingError {
  name: string;
  message: string;
  stack?: string;
}

export type AcceptNFTOfferMessagingResponse = MessagingResponse & AcceptNFTOfferResponse;
export type BurnNFTMessagingResponse = MessagingResponse & BurnNFTResponse;
export type CancelNFTOfferMessagingResponse = MessagingResponse & CancelNFTOfferResponse;
export type CreateNFTOfferMessagingResponse = MessagingResponse & CreateNFTOfferResponse;
export type GetNetworkMessagingResponse = MessagingResponse & GetNetworkResponse;
export type GetNetworkMessagingResponseDeprecated = MessagingResponse &
  GetNetworkResponseDeprecated;
export type GetNFTMessagingResponse = MessagingResponse & GetNFTResponse;
export type GetNFTMessagingResponseDeprecated = MessagingResponse & GetNFTResponseDeprecated;
export type GetAddressMessagingResponse = MessagingResponse & GetAddressResponse;
export type GetAddressMessagingResponseDeprecated = MessagingResponse &
  GetAddressResponseDeprecated;
export type GetPublicKeyMessagingResponse = MessagingResponse & GetPublicKeyResponse;
export type GetPublicKeyMessagingResponseDeprecated = MessagingResponse &
  GetPublicKeyResponseDeprecated;
export type MintNFTMessagingResponse = MessagingResponse & MintNFTResponse;
export type SignMessageMessagingResponse = MessagingResponse & SignMessageResponse;
export type SignMessageMessagingResponseDeprecated = MessagingResponse &
  SignMessageResponseDeprecated;
export type IsInstalledMessagingResponse = MessagingResponse & IsInstalledResponse;
export type SendPaymentMessagingResponse = MessagingResponse & SendPaymentResponse;
export type SendPaymentMessagingResponseDeprecated = MessagingResponse &
  SendPaymentResponseDeprecated;
export type SetAccountMessagingResponse = MessagingResponse & SetAccountResponse;
export type SetTrustlineMessagingResponse = MessagingResponse & SetTrustlineResponse;
export type SetTrustlineMessagingResponseDeprecated = MessagingResponse &
  SetTrustlineResponseDeprecated;

// Content Script Messages
export interface ReceiveSendPaymentContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SEND_PAYMENT/V3';
  payload: SendPaymentMessagingResponse;
}

export interface ReceiveSendPaymentContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_PAYMENT_HASH';
  payload: SendPaymentResponseDeprecated;
}

export interface ReceiveSetTrustlineContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SET_TRUSTLINE/V3';
  payload: SetTrustlineMessagingResponse;
}

export interface ReceiveSetTrustlineContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_TRUSTLINE_HASH';
  payload: SetTrustlineResponseDeprecated;
}

export interface ReceiveGetAddressContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_GET_ADDRESS/V3';
  payload: GetAddressMessagingResponse;
}

export interface ReceiveGetAddressContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_ADDRESS';
  payload: GetAddressResponseDeprecated;
}

export interface ReceiveGetNetworkContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_GET_NETWORK/V3';
  payload: GetNetworkMessagingResponse;
}

export interface ReceiveGetNetworkContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_NETWORK';
  payload: GetNetworkResponseDeprecated;
}

export interface ReceiveGetNFTContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_GET_NFT/V3';
  payload: GetNFTMessagingResponse;
}

export interface ReceiveGetNFTContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_NFT';
  payload: GetNFTResponseDeprecated;
}

export interface ReceiveGetPublicKeyContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_GET_PUBLIC_KEY/V3';
  payload: GetPublicKeyMessagingResponse;
}

export interface ReceiveGetPublicKeyContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_PUBLIC_KEY';
  payload: GetPublicKeyResponseDeprecated;
}

export interface ReceiveSignMessageContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SIGN_MESSAGE/V3';
  payload: SignMessageMessagingResponse;
}

export interface ReceiveSignMessageContentMessageDeprecated {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SIGN_MESSAGE';
  payload: SignMessageResponseDeprecated;
}

export interface ReceiveMintNFTContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_MINT_NFT/V3';
  payload: MintNFTMessagingResponse;
}

export interface ReceiveCreateNFTOfferContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_CREATE_NFT_OFFER/V3';
  payload: CreateNFTOfferMessagingResponse;
}

export interface ReceiveCancelNFTOfferContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_CANCEL_NFT_OFFER/V3';
  payload: CancelNFTOfferMessagingResponse;
}

export interface ReceiveAcceptNFTOfferContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_ACCEPT_NFT_OFFER/V3';
  payload: AcceptNFTOfferMessagingResponse;
}

export interface ReceiveBurnNFTContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_BURN_NFT/V3';
  payload: BurnNFTMessagingResponse;
}

export interface ReceiveSetAccountContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SET_ACCOUNT/V3';
  payload: SetAccountMessagingResponse;
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

export type ReceiveMintNFTBackgroundMessage = ReceiveMintNFTContentMessage &
  BackgroundMessagePayload;

export type ReceiveCreateNFTOfferBackgroundMessage = ReceiveCreateNFTOfferContentMessage &
  BackgroundMessagePayload;

export type ReceiveCancelNFTOfferBackgroundMessage = ReceiveCancelNFTOfferContentMessage &
  BackgroundMessagePayload;

export type ReceiveAcceptNFTOfferBackgroundMessage = ReceiveAcceptNFTOfferContentMessage &
  BackgroundMessagePayload;

export type ReceiveBurnNFTBackgroundMessage = ReceiveBurnNFTContentMessage &
  BackgroundMessagePayload;

export type ReceiveSetAccountBackgroundMessage = ReceiveSetAccountContentMessage &
  BackgroundMessagePayload;

export type BackgroundMessage =
  // Inputted messages - DO NOT contain ID within the payloads
  | RequestAcceptNFTOfferMessage
  | RequestBurnNFTMessage
  | RequestCancelNFTOfferMessage
  | RequestCreateNFTOfferMessage
  | RequestGetAddressMessage
  | RequestGetAddressMessageDeprecated
  | RequestGetNetworkMessage
  | RequestGetNetworkMessageDeprecated
  | RequestGetNFTMessage
  | RequestGetNFTMessageDeprecated
  | RequestGetPublicKeyMessage
  | RequestGetPublicKeyMessageDeprecated
  | RequestMintNFTMessage
  | RequestSendPaymentMessage
  | RequestSendPaymentMessageDeprecated
  | RequestSetAccountMessage
  | RequestSetTrustlineMessage
  | RequestSetTrustlineMessageDeprecated
  | RequestSignMessageMessage
  | RequestSignMessageMessageDeprecated
  // Outputted Messages - DO contain ID within the payloads
  | ReceiveAcceptNFTOfferBackgroundMessage
  | ReceiveBurnNFTBackgroundMessage
  | ReceiveCancelNFTOfferBackgroundMessage
  | ReceiveCreateNFTOfferBackgroundMessage
  | ReceiveGetAddressBackgroundMessage
  | ReceiveGetAddressBackgroundMessageDeprecated
  | ReceiveGetNetworkBackgroundMessage
  | ReceiveGetNetworkBackgroundMessageDeprecated
  | ReceiveGetNFTBackgroundMessage
  | ReceiveGetNFTBackgroundMessageDeprecated
  | ReceiveMintNFTBackgroundMessage
  | ReceivePublicKeyBackgroundMessage
  | ReceivePublicKeyBackgroundMessageDeprecated
  | ReceiveSetAccountBackgroundMessage
  | ReceiveSendPaymentBackgroundMessage
  | ReceiveSendPaymentBackgroundMessageDeprecated
  | ReceiveSetTrustlineBackgroundMessage
  | ReceiveSetTrustlineBackgroundMessageDeprecated
  | ReceiveSignMessageBackgroundMessage
  | ReceiveSignMessageBackgroundMessageDeprecated;

// API Messages
export interface RequestIsInstalledMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_IS_INSTALLED/V3';
}

export type APIMessages =
  | RequestAcceptNFTOfferMessage
  | RequestBurnNFTMessage
  | RequestCancelNFTOfferMessage
  | RequestCreateNFTOfferMessage
  | RequestGetAddressMessage
  | RequestGetNetworkMessage
  | RequestGetNFTMessage
  | RequestGetPublicKeyMessage
  | RequestMintNFTMessage
  | RequestIsInstalledMessage
  | RequestSendPaymentMessage
  | RequestSetAccountMessage
  | RequestSetTrustlineMessage
  | RequestSignMessageMessage;

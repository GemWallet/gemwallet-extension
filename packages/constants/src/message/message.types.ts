import { GEM_WALLET } from '../global/global.constant';
import {
  AcceptNFTOfferResponse,
  AcceptNFTOfferRequest,
  AuthorizeMPTokenRequest,
  AuthorizeMPTokenResponse,
  BurnNFTRequest,
  BurnNFTResponse,
  CancelNFTOfferRequest,
  CancelNFTOfferResponse,
  CancelOfferRequest,
  CancelOfferResponse,
  CreateMPTokenIssuanceRequest,
  CreateMPTokenIssuanceResponse,
  CreateNFTOfferRequest,
  CreateNFTOfferResponse,
  CreateOfferRequest,
  CreateOfferResponse,
  DestroyMPTokenIssuanceRequest,
  DestroyMPTokenIssuanceResponse,
  EventLoginResponse,
  EventLogoutResponse,
  EventNetworkChangedResponse,
  EventWalletChangedResponse,
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
  PasswordInternalResponse,
  SendPaymentRequest,
  SendPaymentRequestDeprecated,
  SendPaymentResponse,
  SendPaymentResponseDeprecated,
  SetAccountResponse,
  SetAccountRequest,
  SetHookResponse,
  SetHookRequest,
  SetMPTokenIssuanceRequest,
  SetMPTokenIssuanceResponse,
  SetRegularKeyResponse,
  SetRegularKeyRequest,
  SetTrustlineResponse,
  SetTrustlineResponseDeprecated,
  SetTrustlineRequest,
  SetTrustlineRequestDeprecated,
  SignMessageResponse,
  SignMessageResponseDeprecated,
  SignMessageRequest,
  SignTransactionResponse,
  SignTransactionRequest,
  SubmitTransactionResponse,
  SubmitTransactionRequest,
  SubmitBulkTransactionsWithKeysRequest,
  SubmitBulkTransactionsResponse,
  WebsiteRequest
} from '../payload/payload.types';
import {
  MSG_INTERNAL_RECEIVE_PASSWORD,
  MSG_INTERNAL_RECEIVE_SIGN_OUT,
  MSG_INTERNAL_REQUEST_PASSWORD
} from './message.constant';

export type RequestMessage =
  | 'REQUEST_ACCEPT_NFT_OFFER/V3'
  | 'REQUEST_ADDRESS'
  | 'REQUEST_ADD_TRUSTLINE'
  | 'REQUEST_BURN_NFT/V3'
  | 'REQUEST_CONNECTION'
  | 'REQUEST_CANCEL_NFT_OFFER/V3'
  | 'REQUEST_CANCEL_OFFER/V3'
  | 'REQUEST_CREATE_NFT_OFFER/V3'
  | 'REQUEST_CREATE_OFFER/V3'
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
  | 'REQUEST_SET_HOOK/V3'
  | 'REQUEST_SET_REGULAR_KEY/V3'
  | 'REQUEST_SET_TRUSTLINE/V3'
  | 'REQUEST_SIGN_MESSAGE'
  | 'REQUEST_SIGN_MESSAGE/V3'
  | 'REQUEST_SIGN_TRANSACTION/V3'
  | 'REQUEST_SUBMIT_TRANSACTION/V3'
  | 'REQUEST_SUBMIT_BULK_TRANSACTIONS/V3'
  | 'REQUEST_AUTHORIZE_MPTOKEN/V3'
  | 'REQUEST_CREATE_MPTOKEN_ISSUANCE/V3'
  | 'REQUEST_DESTROY_MPTOKEN_ISSUANCE/V3'
  | 'REQUEST_SET_MPTOKEN_ISSUANCE/V3'
  | 'SEND_PAYMENT';

export type ReceiveMessage =
  | 'RECEIVE_ACCEPT_NFT_OFFER/V3'
  | 'RECEIVE_ADDRESS'
  | 'RECEIVE_BURN_NFT/V3'
  | 'RECEIVE_CANCEL_NFT_OFFER/V3'
  | 'RECEIVE_CANCEL_OFFER/V3'
  | 'RECEIVE_CREATE_NFT_OFFER/V3'
  | 'RECEIVE_CREATE_OFFER/V3'
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
  | 'RECEIVE_SET_HOOK/V3'
  | 'RECEIVE_SET_REGULAR_KEY/V3'
  | 'RECEIVE_SET_TRUSTLINE/V3'
  | 'RECEIVE_SIGN_MESSAGE'
  | 'RECEIVE_SIGN_MESSAGE/V3'
  | 'RECEIVE_SIGN_TRANSACTION/V3'
  | 'RECEIVE_SUBMIT_TRANSACTION/V3'
  | 'RECEIVE_SUBMIT_BULK_TRANSACTIONS/V3'
  | 'RECEIVE_AUTHORIZE_MPTOKEN/V3'
  | 'RECEIVE_CREATE_MPTOKEN_ISSUANCE/V3'
  | 'RECEIVE_DESTROY_MPTOKEN_ISSUANCE/V3'
  | 'RECEIVE_SET_MPTOKEN_ISSUANCE/V3';

export type EventMessage =
  | 'EVENT_NETWORK_CHANGED'
  | 'EVENT_WALLET_CHANGED'
  | 'EVENT_LOGIN'
  | 'EVENT_LOGOUT';

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

export interface RequestSetRegularKeyMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SET_REGULAR_KEY/V3';
  payload: SetRegularKeyRequest;
}

export interface RequestCreateOfferMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_CREATE_OFFER/V3';
  payload: CreateOfferRequest;
}

export interface RequestCancelOfferMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_CANCEL_OFFER/V3';
  payload: CancelOfferRequest;
}

export interface RequestSubmitTransactionMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SUBMIT_TRANSACTION/V3';
  payload: SubmitTransactionRequest;
}

export interface RequestSignTransactionMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SIGN_TRANSACTION/V3';
  payload: SignTransactionRequest;
}

export interface RequestSubmitBulkTransactionsMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SUBMIT_BULK_TRANSACTIONS/V3';
  payload: SubmitBulkTransactionsWithKeysRequest;
}

export interface RequestSetHookMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SET_HOOK/V3';
  payload: SetHookRequest;
}

// MPToken Request Messages
export interface RequestAuthorizeMPTokenMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_AUTHORIZE_MPTOKEN/V3';
  payload: AuthorizeMPTokenRequest;
}

export interface RequestCreateMPTokenIssuanceMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_CREATE_MPTOKEN_ISSUANCE/V3';
  payload: CreateMPTokenIssuanceRequest;
}

export interface RequestDestroyMPTokenIssuanceMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_DESTROY_MPTOKEN_ISSUANCE/V3';
  payload: DestroyMPTokenIssuanceRequest;
}

export interface RequestSetMPTokenIssuanceMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_SET_MPTOKEN_ISSUANCE/V3';
  payload: SetMPTokenIssuanceRequest;
}

// Internal
export interface InternalRequestPasswordMessage {
  app: typeof GEM_WALLET;
  type: typeof MSG_INTERNAL_REQUEST_PASSWORD;
}

/*
 * Responses
 */
export type MessagingResponse = {
  source?: 'GEM_WALLET_MSG_RESPONSE';
  messagedId?: number;
  error?: MessagingError;
};

// Internal
export type InternalMessagingResponse = {
  source?: 'INTERNAL_RESPONSE';
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
export type CancelOfferMessagingResponse = MessagingResponse & CancelOfferResponse;
export type CreateNFTOfferMessagingResponse = MessagingResponse & CreateNFTOfferResponse;
export type CreateOfferMessagingResponse = MessagingResponse & CreateOfferResponse;
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
export type SignTransactionMessagingResponse = MessagingResponse & SignTransactionResponse;
export type SubmitTransactionMessagingResponse = MessagingResponse & SubmitTransactionResponse;
export type SubmitBulkTransactionsMessagingResponse = MessagingResponse &
  SubmitBulkTransactionsResponse;
export type IsInstalledMessagingResponse = MessagingResponse & IsInstalledResponse;
export type SendPaymentMessagingResponse = MessagingResponse & SendPaymentResponse;
export type SendPaymentMessagingResponseDeprecated = MessagingResponse &
  SendPaymentResponseDeprecated;
export type SetAccountMessagingResponse = MessagingResponse & SetAccountResponse;
export type SetHookMessagingResponse = MessagingResponse & SetHookResponse;
export type SetRegularKeyMessagingResponse = MessagingResponse & SetRegularKeyResponse;
export type SetTrustlineMessagingResponse = MessagingResponse & SetTrustlineResponse;
export type SetTrustlineMessagingResponseDeprecated = MessagingResponse &
  SetTrustlineResponseDeprecated;

// MPToken Messaging Responses
export type AuthorizeMPTokenMessagingResponse = MessagingResponse & AuthorizeMPTokenResponse;
export type CreateMPTokenIssuanceMessagingResponse = MessagingResponse &
  CreateMPTokenIssuanceResponse;
export type DestroyMPTokenIssuanceMessagingResponse = MessagingResponse &
  DestroyMPTokenIssuanceResponse;
export type SetMPTokenIssuanceMessagingResponse = MessagingResponse & SetMPTokenIssuanceResponse;

// Internal
export type PasswordInternalMessagingResponse = InternalMessagingResponse &
  PasswordInternalResponse;

// Event Responses
export type EventNetworkChangedMessagingResponse = MessagingResponse & EventNetworkChangedResponse;
export type EventWalletChangedMessagingResponse = MessagingResponse & EventWalletChangedResponse;
export type EventLoginMessagingResponse = MessagingResponse & EventLoginResponse;
export type EventLogoutMessagingResponse = MessagingResponse & EventLogoutResponse;

/*
 * Content Script Messages
 */
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

export interface ReceiveSetRegularKeyContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SET_REGULAR_KEY/V3';
  payload: SetRegularKeyMessagingResponse;
}

export interface ReceiveCreateOfferContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_CREATE_OFFER/V3';
  payload: CreateOfferMessagingResponse;
}

export interface ReceiveCancelOfferContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_CANCEL_OFFER/V3';
  payload: CancelOfferMessagingResponse;
}

export interface ReceiveSubmitTransactionContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SUBMIT_TRANSACTION/V3';
  payload: SubmitTransactionMessagingResponse;
}

export interface ReceiveSignTransactionContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SIGN_TRANSACTION/V3';
  payload: SignTransactionMessagingResponse;
}

export interface ReceiveSubmitBulkTransactionsContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SUBMIT_BULK_TRANSACTIONS/V3';
  payload: SubmitBulkTransactionsMessagingResponse;
}

export interface ReceiveSetHookContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SET_HOOK/V3';
  payload: SetHookMessagingResponse;
}

// MPToken Content Messages
export interface ReceiveAuthorizeMPTokenContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_AUTHORIZE_MPTOKEN/V3';
  payload: AuthorizeMPTokenMessagingResponse;
}

export interface ReceiveCreateMPTokenIssuanceContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_CREATE_MPTOKEN_ISSUANCE/V3';
  payload: CreateMPTokenIssuanceMessagingResponse;
}

export interface ReceiveDestroyMPTokenIssuanceContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_DESTROY_MPTOKEN_ISSUANCE/V3';
  payload: DestroyMPTokenIssuanceMessagingResponse;
}

export interface ReceiveSetMPTokenIssuanceContentMessage {
  app: typeof GEM_WALLET;
  type: 'RECEIVE_SET_MPTOKEN_ISSUANCE/V3';
  payload: SetMPTokenIssuanceMessagingResponse;
}

// Internal
export interface InternalReceivePasswordContentMessage {
  app: typeof GEM_WALLET;
  type: typeof MSG_INTERNAL_RECEIVE_PASSWORD;
  payload: PasswordInternalMessagingResponse;
}

export interface InternalReceiveSignOutContentMessage {
  app: typeof GEM_WALLET;
  type: typeof MSG_INTERNAL_RECEIVE_SIGN_OUT;
}

// Event Messages
export interface EventNetworkChangedContentMessage {
  app: typeof GEM_WALLET;
  type: 'EVENT_NETWORK_CHANGED';
  source: 'GEM_WALLET_MSG_REQUEST';
  payload: EventNetworkChangedMessagingResponse;
}

export interface EventWalletChangedContentMessage {
  app: typeof GEM_WALLET;
  type: 'EVENT_WALLET_CHANGED';
  source: 'GEM_WALLET_MSG_REQUEST';
  payload: EventWalletChangedMessagingResponse;
}

export interface EventLoginContentMessage {
  app: typeof GEM_WALLET;
  type: 'EVENT_LOGIN';
  source: 'GEM_WALLET_MSG_REQUEST';
  payload: EventLoginMessagingResponse;
}

export interface EventLogoutContentMessage {
  app: typeof GEM_WALLET;
  type: 'EVENT_LOGOUT';
  source: 'GEM_WALLET_MSG_REQUEST';
  payload: EventLogoutMessagingResponse;
}

export type EventContentMessage =
  | EventNetworkChangedContentMessage
  | EventWalletChangedContentMessage
  | EventLoginContentMessage
  | EventLogoutContentMessage;

/*
 * Background Script Messages
 */
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

export type ReceiveSetRegularKeyBackgroundMessage = ReceiveSetRegularKeyContentMessage &
  BackgroundMessagePayload;

export type ReceiveCreateOfferBackgroundMessage = ReceiveCreateOfferContentMessage &
  BackgroundMessagePayload;

export type ReceiveCancelOfferBackgroundMessage = ReceiveCancelOfferContentMessage &
  BackgroundMessagePayload;

export type ReceiveSignTransactionBackgroundMessage = ReceiveSignTransactionContentMessage &
  BackgroundMessagePayload;

export type ReceiveSubmitTransactionBackgroundMessage = ReceiveSubmitTransactionContentMessage &
  BackgroundMessagePayload;

export type ReceiveSubmitBulkTransactionsBackgroundMessage =
  ReceiveSubmitBulkTransactionsContentMessage & BackgroundMessagePayload;

export type ReceiveSetHookBackgroundMessage = ReceiveSetHookContentMessage &
  BackgroundMessagePayload;

// MPToken Background Messages
export type ReceiveAuthorizeMPTokenBackgroundMessage = ReceiveAuthorizeMPTokenContentMessage &
  BackgroundMessagePayload;

export type ReceiveCreateMPTokenIssuanceBackgroundMessage =
  ReceiveCreateMPTokenIssuanceContentMessage & BackgroundMessagePayload;

export type ReceiveDestroyMPTokenIssuanceBackgroundMessage =
  ReceiveDestroyMPTokenIssuanceContentMessage & BackgroundMessagePayload;

export type ReceiveSetMPTokenIssuanceBackgroundMessage = ReceiveSetMPTokenIssuanceContentMessage &
  BackgroundMessagePayload;

export type InternalReceivePasswordBackgroundMessage = InternalReceivePasswordContentMessage &
  BackgroundMessagePayload;

export type InternalReceiveSignedOutBackgroundMessage = InternalReceiveSignOutContentMessage &
  BackgroundMessagePayload;

export type EventNetworkChangedBackgroundMessage = EventNetworkChangedContentMessage &
  BackgroundMessagePayload;

export type EventWalletChangedBackgroundMessage = EventWalletChangedContentMessage &
  BackgroundMessagePayload;

export type EventLoginBackgroundMessage = EventLoginContentMessage & BackgroundMessagePayload;

export type EventLogoutBackgroundMessage = EventLogoutContentMessage & BackgroundMessagePayload;

export type BackgroundMessage =
  //
  // API requests and responses messages
  //
  // Inputted messages - DO NOT contain ID within the payloads
  | RequestAcceptNFTOfferMessage
  | RequestBurnNFTMessage
  | RequestCancelNFTOfferMessage
  | RequestCancelOfferMessage
  | RequestCreateNFTOfferMessage
  | RequestCreateOfferMessage
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
  | RequestSetHookMessage
  | RequestSetRegularKeyMessage
  | RequestSetTrustlineMessage
  | RequestSetTrustlineMessageDeprecated
  | RequestSignMessageMessage
  | RequestSignMessageMessageDeprecated
  | RequestSignTransactionMessage
  | RequestSubmitTransactionMessage
  | RequestSubmitBulkTransactionsMessage
  | RequestAuthorizeMPTokenMessage
  | RequestCreateMPTokenIssuanceMessage
  | RequestDestroyMPTokenIssuanceMessage
  | RequestSetMPTokenIssuanceMessage
  // Outputted Messages - DO contain ID within the payloads
  | EventLoginBackgroundMessage
  | EventLogoutBackgroundMessage
  | EventNetworkChangedBackgroundMessage
  | EventWalletChangedBackgroundMessage
  | ReceiveAcceptNFTOfferBackgroundMessage
  | ReceiveBurnNFTBackgroundMessage
  | ReceiveCancelNFTOfferBackgroundMessage
  | ReceiveCancelOfferBackgroundMessage
  | ReceiveCreateNFTOfferBackgroundMessage
  | ReceiveCreateOfferBackgroundMessage
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
  | ReceiveSetHookBackgroundMessage
  | ReceiveSetRegularKeyBackgroundMessage
  | ReceiveSendPaymentBackgroundMessage
  | ReceiveSendPaymentBackgroundMessageDeprecated
  | ReceiveSetTrustlineBackgroundMessage
  | ReceiveSetTrustlineBackgroundMessageDeprecated
  | ReceiveSignMessageBackgroundMessage
  | ReceiveSignMessageBackgroundMessageDeprecated
  | ReceiveSignTransactionBackgroundMessage
  | ReceiveSubmitTransactionBackgroundMessage
  | ReceiveSubmitBulkTransactionsBackgroundMessage
  | ReceiveAuthorizeMPTokenBackgroundMessage
  | ReceiveCreateMPTokenIssuanceBackgroundMessage
  | ReceiveDestroyMPTokenIssuanceBackgroundMessage
  | ReceiveSetMPTokenIssuanceBackgroundMessage
  //
  // Internal message - Messages between the extension and the background script
  //
  // Inputted
  | InternalRequestPasswordMessage
  // Outputted
  | InternalReceivePasswordBackgroundMessage
  | InternalReceiveSignedOutBackgroundMessage;

// API Messages
export interface RequestIsInstalledMessage {
  app: typeof GEM_WALLET;
  type: 'REQUEST_IS_INSTALLED/V3';
}

export type APIMessages =
  | RequestAcceptNFTOfferMessage
  | RequestBurnNFTMessage
  | RequestCancelNFTOfferMessage
  | RequestCancelOfferMessage
  | RequestCreateNFTOfferMessage
  | RequestCreateOfferMessage
  | RequestGetAddressMessage
  | RequestGetNetworkMessage
  | RequestGetNFTMessage
  | RequestGetPublicKeyMessage
  | RequestMintNFTMessage
  | RequestIsInstalledMessage
  | RequestSendPaymentMessage
  | RequestSetAccountMessage
  | RequestSetHookMessage
  | RequestSetRegularKeyMessage
  | RequestSetTrustlineMessage
  | RequestSignMessageMessage
  | RequestSignTransactionMessage
  | RequestSubmitTransactionMessage
  | RequestSubmitBulkTransactionsMessage
  | RequestAuthorizeMPTokenMessage
  | RequestCreateMPTokenIssuanceMessage
  | RequestDestroyMPTokenIssuanceMessage
  | RequestSetMPTokenIssuanceMessage;

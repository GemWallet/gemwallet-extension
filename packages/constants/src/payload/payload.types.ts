import { NFTokenMintFlagsInterface } from 'xrpl';
import { Amount, IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common';

import { Network } from '../network/network.constant';
import { Memo, PaymentFlags, TrustSetFlags } from '../xrpl/basic.types';
import { AccountNFToken } from './../xrpl/nft.types';

/*
 * Request Payloads
 */

export interface GetNetworkRequest {
  id: number | undefined;
}

export interface WebsiteRequest {
  url: string;
  title: string;
  favicon: string | null | undefined;
}

export interface SendPaymentRequest {
  // The amount to deliver, in one of the following formats:
  // - A string representing the number of XRP to deliver, in drops.
  // - An object where 'value' is a string representing the number of the token to deliver.
  amount: Amount;
  // The unique address of the account receiving the payment
  destination: string;
  // The memos to attach to the transaction
  // Each attribute of each memo must be hex encoded
  memos?: Memo[];
  // The destination tag to attach to the transaction
  destinationTag?: number;
  // Integer amount of XRP, in drops, to be destroyed as a cost for distributing this transaction to the network
  fee?: string;
  // Flags to set on the transaction
  flags?: PaymentFlags;
}

export interface SendPaymentRequestDeprecated {
  // The amount of currency to deliver (in currency, not drops)
  amount: string;
  // The token that can be used
  currency?: string;
  // The issuer of the token
  issuer?: string;
  // The memo to attach to the transaction
  memo?: string;
  // The destination tag to attach to the transaction
  destinationTag?: string;
}

export interface SetTrustlineRequest {
  // The maximum amount of currency that can be exchanged to the trustline
  limitAmount: IssuedCurrencyAmount;
  // Integer amount of XRP, in drops, to be destroyed as a cost for distributing this transaction to the network.
  // Some transaction types have different minimum requirements.
  fee?: string;
  // The memos to attach to the transaction
  // Each attribute of each memo must be hex encoded
  memos?: Memo[];
  // Flags to set on the transaction
  flags?: TrustSetFlags;
}

export interface SetTrustlineRequestDeprecated {
  // The token to be used
  currency: string;
  // The address of the account owing the token
  issuer: string;
  // Integer amount of XRP, in drops, to be destroyed as a cost for distributing this transaction to the network.
  // Some transaction types have different minimum requirements.
  fee?: string;
  // 	The maximum amount of currency that can be exchanged to the trustline
  value: string;
}

export interface MintNFTRequestPayload {
  URI: string | null;
  flags: number | NFTokenMintFlagsInterface | null;
  //TODO: Maybe we would need the issuer, maybe we can issue for someone else?
  transferFee: number | null;
  NFTokenTaxon: number | null;
}

export interface GetNFTRequest {
  // Limit the number of NFTokens to retrieve.
  limit?: number;
  // Value from a previous paginated response. Resume retrieving data where that response left off.
  marker?: unknown;
}

export interface SignMessageRequest {
  url: string;
  title: string;
  favicon: string | null | undefined;
  message: string;
}

export type RequestPayload =
  | GetNetworkRequest
  | GetNFTRequest
  | MintNFTRequestPayload
  | WebsiteRequest
  | SendPaymentRequest
  | SendPaymentRequestDeprecated
  | SetTrustlineRequest
  | SetTrustlineRequestDeprecated
  | SignMessageRequest;

/*
 * Response Payloads
 */
export const enum ResponseType {
  Response = 'response',
  Reject = 'reject'
}

interface BaseResponse<T> {
  type: ResponseType;
  result?: T;
}

export interface GetNetworkResponse extends BaseResponse<{ network: Network }> {}

export interface GetNetworkResponseDeprecated {
  network: Network | undefined;
}

export interface GetAddressResponse extends BaseResponse<{ address: string }> {}

export interface GetAddressResponseDeprecated {
  publicAddress: string | null | undefined;
}

export interface GetPublicKeyResponse
  extends BaseResponse<{ address: string; publicKey: string }> {}

export interface GetPublicKeyResponseDeprecated {
  address: string | null | undefined;
  publicKey: string | null | undefined;
}

export interface SignMessageResponse extends BaseResponse<{ signedMessage: string }> {}

export interface SignMessageResponseDeprecated {
  signedMessage: string | null | undefined;
}

export interface IsInstalledResponse {
  result: { isInstalled: boolean };
}

export interface SendPaymentResponse extends BaseResponse<{ hash: string }> {}

export interface SendPaymentResponseDeprecated {
  hash: string | null | undefined;
}

export interface SetTrustlineResponse extends BaseResponse<{ hash: string }> {}

export interface SetTrustlineResponseDeprecated {
  hash: string | null | undefined;
}

export interface GetNFTResponse
  extends BaseResponse<{ account_nfts: AccountNFToken[]; marker?: unknown }> {}

export interface GetNFTResponseDeprecated {
  nfts: AccountNFToken[] | null | undefined;
}

export interface MintNFTResponsePayload {
  NFTokenID: string;
  URI: string | undefined;
  hash: string;
}

export type ResponsePayload =
  | GetAddressResponse
  | GetAddressResponseDeprecated
  | GetNFTResponse
  | GetNFTResponseDeprecated
  | GetNetworkResponse
  | GetNetworkResponseDeprecated
  | GetPublicKeyResponse
  | GetPublicKeyResponseDeprecated
  | IsInstalledResponse
  | MintNFTResponsePayload
  | SendPaymentResponse
  | SendPaymentResponseDeprecated
  | SetTrustlineResponse
  | SetTrustlineResponseDeprecated
  | SignMessageResponse
  | SignMessageResponseDeprecated;

import { Amount, IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common';

import { Network } from '../network/network.constant';
import { Memo, PaymentFlags, TrustSetFlags } from '../xrpl/basic.types';
import { AccountNFToken } from './../xrpl/nft.types';

/*
 * Request Payloads
 */

export interface GetNetworkRequestPayload {
  id: number | undefined;
}

export interface WebsiteRequestPayload {
  url: string;
  title: string;
  favicon: string | null | undefined;
}

export interface SendPaymentRequestPayload {
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

export interface SendPaymentRequestPayloadDeprecated {
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

export interface SetTrustlineRequestPayload {
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

export interface SetTrustlineRequestPayloadDeprecated {
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

export interface GetNFTRequestPayload {
  // Limit the number of NFTokens to retrieve.
  limit?: number;
  // Value from a previous paginated response. Resume retrieving data where that response left off.
  marker?: unknown;
}

export interface SignMessageRequestPayload {
  url: string;
  title: string;
  favicon: string | null | undefined;
  message: string;
}

export type RequestPayload =
  | GetNetworkRequestPayload
  | GetNFTRequestPayload
  | WebsiteRequestPayload
  | SendPaymentRequestPayload
  | SendPaymentRequestPayloadDeprecated
  | SetTrustlineRequestPayload
  | SetTrustlineRequestPayloadDeprecated
  | SignMessageRequestPayload;

/*
 * Response Payloads
 */
export interface GetNetworkResponsePayload {
  result: { network: Network } | undefined;
}

export interface GetNetworkResponsePayloadDeprecated {
  network: Network | undefined;
}

export interface GetAddressResponsePayload {
  result: { publicAddress: string } | null | undefined;
}

export interface GetAddressResponsePayloadDeprecated {
  publicAddress: string | null | undefined;
}

export interface GetPublicKeyResponsePayload {
  result: { address: string; publicKey: string } | null | undefined;
}

export interface GetPublicKeyResponsePayloadDeprecated {
  address: string | null | undefined;
  publicKey: string | null | undefined;
}

export interface SignedMessageResponsePayload {
  result: { signedMessage: string } | null | undefined;
}

export interface SignedMessageResponsePayloadDeprecated {
  signedMessage: string | null | undefined;
}

export interface IsConnectedResponsePayload {
  isConnected: boolean;
}

export interface SendPaymentResponse {
  result: { hash: string } | null | undefined;
}

export interface SendPaymentResponseDeprecated {
  hash: string | null | undefined;
}

export interface SetTrustlineResponse {
  result: { hash: string } | null | undefined;
}

export interface SetTrustlineResponseDeprecated {
  hash: string | null | undefined;
}

export interface GetNFTResponsePayload {
  result: { account_nfts: AccountNFToken[]; marker?: unknown } | null | undefined;
}

export interface GetNFTResponsePayloadDeprecated {
  nfts: AccountNFToken[] | null | undefined;
}

export type ResponsePayload =
  | GetAddressResponsePayload
  | GetAddressResponsePayloadDeprecated
  | GetNFTResponsePayload
  | GetNFTResponsePayloadDeprecated
  | IsConnectedResponsePayload
  | GetNetworkResponsePayload
  | GetNetworkResponsePayloadDeprecated
  | GetPublicKeyResponsePayload
  | GetPublicKeyResponsePayloadDeprecated
  | SendPaymentResponse
  | SendPaymentResponseDeprecated
  | SetTrustlineResponse
  | SetTrustlineResponseDeprecated
  | SignedMessageResponsePayload
  | SignedMessageResponsePayloadDeprecated;

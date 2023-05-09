import { PaymentFlagsInterface } from 'xrpl';
import { Amount } from 'xrpl/dist/npm/models/common';

import { Network } from '../network/network.constant';
import { AccountNFToken } from './../xrpl/nft.types';

/*
 * Request Payloads
 */

export interface NetworkRequestPayload {
  id: number | undefined;
}

export interface WebsiteRequestPayload {
  url: string;
  title: string;
  favicon: string | null | undefined;
}

export interface PaymentRequestPayload {
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

export interface Memo {
  memo: {
    memoType?: string;
    memoData?: string;
    memoFormat?: string;
  };
}

export type PaymentFlags = PaymentFlagsInterface | number;

export interface TrustlineRequestPayload {
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

export interface NFTRequestPayload {
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
  | NetworkRequestPayload
  | WebsiteRequestPayload
  | PaymentRequestPayload
  | TrustlineRequestPayload
  | NFTRequestPayload
  | SignMessageRequestPayload;

/*
 * Response Payloads
 */
export interface NetworkResponsePayload {
  network: Network | undefined;
}

export interface AddressResponsePayload {
  publicAddress: string | null | undefined;
}

export interface PublicKeyResponsePayload {
  address: string | null | undefined;
  publicKey: string | null | undefined;
}

export interface SignedMessageResponsePayload {
  signedMessage: string | null | undefined;
}

export interface IsConnectedResponsePayload {
  isConnected: boolean;
}

export interface PaymentHashResponsePayload {
  hash: string | null | undefined;
}

export interface TrustlineHashResponsePayload {
  hash: string | null | undefined;
}

export interface NFTResponsePayload {
  nfts: AccountNFToken[] | null | undefined;
}

export type ResponsePayload =
  | NetworkResponsePayload
  | AddressResponsePayload
  | PublicKeyResponsePayload
  | SignedMessageResponsePayload
  | IsConnectedResponsePayload
  | PaymentHashResponsePayload
  | TrustlineHashResponsePayload
  | NFTResponsePayload;

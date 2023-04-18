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
  // 	The amount of currency to deliver (in drops)
  amount: string;
  // The unique address of the account receiving the payment
  destination: string;
  // The token that can be used
  currency?: string;
  // The issuer of the token
  issuer?: string;
  // The memo to attach to the transaction
  memo?: string;
}

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

export const DEFAULT_MEMO_TYPE = 'Description';

export const buildMemos = (memoData: string | undefined): { Memo: { MemoType: string; MemoData: string } }[] => {
  if (memoData === undefined) return [];
  return [
    {
      Memo: {
        MemoType: Buffer.from(DEFAULT_MEMO_TYPE, 'utf8').toString('hex').toUpperCase(),
        MemoData: Buffer.from(memoData, 'utf8').toString('hex').toUpperCase()
      }
    }
  ];
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

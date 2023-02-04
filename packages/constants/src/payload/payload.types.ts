import { Network } from '../network/network.constant';

/*
 * Request Payloads
 */

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
}

export interface TrustlineRequestPayload {
  // The token to be used
  currency: string;
  // The address of the account owing the token
  issuer: string;
  // Integer amount of XRP, in drops, to be destroyed as a cost for distributing this transaction to the network.
  // Some transaction types have different minimum requirements.
  fee?: string;
  // 	The amount of currency to deliver
  value: string;
}

export interface SignMessageRequestPayload {
  url: string;
  title: string;
  favicon: string | null | undefined;
  message: string;
}

/*
 * Response Payloads
 */
export interface NetworkResponsePayload {
  network: Network;
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

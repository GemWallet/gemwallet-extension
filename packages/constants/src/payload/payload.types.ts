import { Amount, IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common';

import { Network } from '../network/network.constant';
import { Memo, MintNFTFlags, PaymentFlags, Signer, TrustSetFlags } from '../xrpl/basic.types';
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

export interface MintNFTRequest {
  // Hash value identifying another transaction. If provided, this transaction is only valid if the sending account's
  // previously-sent transaction matches the provided hash.
  accountTxnID?: string;
  // Integer amount of XRP, in drops, to be destroyed as a cost for distributing this transaction to the network.
  // Some transaction types have different minimum requirements.
  fee?: string;
  flags?: MintNFTFlags;
  // Indicates the issuer of the token.
  // Should only be specified if the account executing the transaction is not the Issuer of the token, e.g. when minting on behalf of another account.
  issuer?: string;
  // Highest ledger index this transaction can appear in. Specifying this field places a strict upper limit on how long
  // the transaction can wait to be validated or rejected.
  lastLedgerSequence?: number;
  // Additional arbitrary information used to identify this transaction.
  // Each attribute of each memo must be hex encoded.
  memos?: Memo[];
  // Indicates the taxon associated with this token. The taxon is generally a value chosen by the minter of the token
  // and a given taxon may be used for multiple tokens. The implementation reserves taxon identifiers greater than or
  // equal to 2147483648 (0x80000000). If you have no use for this field, set it to 0.
  NFTokenTaxon: number;
  // The sequence number of the account sending the transaction. A transaction is only valid if the Sequence number is
  // exactly 1 greater than the previous transaction from the same account. The special case 0 means the transaction is
  // using a Ticket instead.
  sequence?: number;
  // Array of objects that represent a multi-signature which authorizes this transaction.
  signers?: Signer[];
  // Hex representation of the public key that corresponds to the private key used to sign this transaction. If an empty
  // string, indicates a multi-signature is present in the Signers field instead.
  signingPubKey?: string;
  // Arbitrary integer used to identify the reason for this payment, or a sender on whose behalf this transaction is
  // made. Conventionally, a refund should specify the initial payment's SourceTag as the refund payment's
  // DestinationTag.
  sourceTag?: number;
  // The sequence number of the ticket to use in place of a Sequence number. If this is provided, Sequence must be 0.
  // Cannot be used with AccountTxnID.
  ticketSequence?: number;
  // Specifies the fee charged by the issuer for secondary sales of the Token, if such sales are allowed. Valid values
  // for this field are between 0 and 50000 inclusive, allowing transfer rates between 0.000% and 50.000% in increments
  // of 0.001%. This field must NOT be present if the tfTransferable flag is not set.
  transferFee?: number;
  // The signature that verifies this transaction as originating from the account it says it is from.
  txnSignature?: string;
  // URI that points to the data and/or metadata associated with the NFT. This field need not be an HTTP or HTTPS URL;
  // it could be an IPFS URI, a magnet link, immediate data encoded as an RFC2379 "data" URL, or even an opaque
  // issuer-specific encoding. The URI is NOT checked for validity, but the field is limited to a maximum length of
  // 256 bytes.
  // This field must be hex-encoded.
  URI?: string;
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
  | MintNFTRequest
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

export interface MintNFTResponse
  extends BaseResponse<{
    NFTokenID: string;
    URI: string | undefined;
    hash: string;
  }> {}

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
  | MintNFTResponse
  | SendPaymentResponse
  | SendPaymentResponseDeprecated
  | SetTrustlineResponse
  | SetTrustlineResponseDeprecated
  | SignMessageResponse
  | SignMessageResponseDeprecated;

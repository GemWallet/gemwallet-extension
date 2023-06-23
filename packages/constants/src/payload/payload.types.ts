import { AccountSetAsfFlags } from 'xrpl';
import { Amount, IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common';

import { Network } from '../network/network.constant';
import {
  Memo,
  MintNFTFlags,
  PaymentFlags,
  Signer,
  TrustSetFlags,
  CreateNFTOfferFlags,
  SetAccountFlags,
  CreateOfferFlags
} from '../xrpl/basic.types';
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

export interface BaseTransactionRequest {
  // Integer amount of XRP, in drops, to be destroyed as a cost for distributing this transaction to the network.
  // Some transaction types have different minimum requirements.
  fee?: string;
  // The sequence number of the account sending the transaction. A transaction is only valid if the Sequence number is
  // exactly 1 greater than the previous transaction from the same account. The special case 0 means the transaction is
  // using a Ticket instead.
  sequence?: number;
  // Hash value identifying another transaction. If provided, this transaction is only valid if the sending account's
  // previously-sent transaction matches the provided hash.
  accountTxnID?: string;
  // Highest ledger index this transaction can appear in. Specifying this field places a strict upper limit on how long
  // the transaction can wait to be validated or rejected.
  lastLedgerSequence?: number;
  // Additional arbitrary information used to identify this transaction.
  // Each attribute of each memo must be hex encoded.
  memos?: Memo[];
  // Array of objects that represent a multi-signature which authorizes this transaction.
  signers?: Signer[];
  // Arbitrary integer used to identify the reason for this payment, or a sender on whose behalf this transaction is
  // made. Conventionally, a refund should specify the initial payment's SourceTag as the refund payment's
  // DestinationTag.
  sourceTag?: number;
  // Hex representation of the public key that corresponds to the private key used to sign this transaction. If an empty
  // string, indicates a multi-signature is present in the Signers field instead.
  signingPubKey?: string;
  // The sequence number of the ticket to use in place of a Sequence number. If this is provided, Sequence must be 0.
  // Cannot be used with AccountTxnID.
  ticketSequence?: number;
  // The signature that verifies this transaction as originating from the account it says it is from.
  txnSignature?: string;
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

export interface MintNFTRequest extends BaseTransactionRequest {
  flags?: MintNFTFlags;
  // Indicates the issuer of the token.
  // Should only be specified if the account executing the transaction is not the Issuer of the token, e.g. when minting on behalf of another account.
  issuer?: string;
  // Indicates the taxon associated with this token. The taxon is generally a value chosen by the minter of the token
  // and a given taxon may be used for multiple tokens. The implementation reserves taxon identifiers greater than or
  // equal to 2147483648 (0x80000000). If you have no use for this field, set it to 0.
  NFTokenTaxon: number;
  // Specifies the fee charged by the issuer for secondary sales of the Token, if such sales are allowed. Valid values
  // for this field are between 0 and 50000 inclusive, allowing transfer rates between 0.000% and 50.000% in increments
  // of 0.001%. This field must NOT be present if the tfTransferable flag is not set.
  transferFee?: number;
  // URI that points to the data and/or metadata associated with the NFT. This field need not be an HTTP or HTTPS URL;
  // it could be an IPFS URI, a magnet link, immediate data encoded as an RFC2379 "data" URL, or even an opaque
  // issuer-specific encoding. The URI is NOT checked for validity, but the field is limited to a maximum length of
  // 256 bytes.
  // This field must be hex-encoded.
  URI?: string;
}

export interface CreateNFTOfferRequest extends BaseTransactionRequest {
  // Identifies the NFTokenID of the NFToken object that the offer references.
  NFTokenID: string;
  // Indicates the amount expected or offered for the Token.
  // The amount must be non-zero, except when this is a sell offer and the asset is XRP. This would indicate that the
  // current owner of the token is giving it away free, either to anyone at all, or to the account identified by the
  // Destination field.
  amount: Amount;
  // Indicates the AccountID of the account that owns the corresponding NFToken.
  // If the offer is to buy a token, this field must be present and it must be different than Account (since an offer
  // to buy a token one already holds is meaningless).
  // If the offer is to sell a token, this field must not be present, as the owner is, implicitly, the same as Account
  // (since an offer to sell a token one doesn't already hold is meaningless).
  owner?: string;
  // Indicates the time after which the offer will no longer be valid. The value is the number of seconds since the
  // Ripple Epoch.
  expiration?: number;
  // If present, indicates that this offer may only be accepted by the specified account. Attempts by other accounts to
  // accept this offer MUST fail.
  destination?: string;
  flags?: CreateNFTOfferFlags;
}

export interface CancelNFTOfferRequest extends BaseTransactionRequest {
  // An array of IDs of the NFTokenOffer objects to cancel (not the IDs of NFToken objects, but the IDs of the
  // NFTokenOffer objects). Each entry must be a different object ID of an NFTokenOffer object; the transaction is
  // invalid if the array contains duplicate entries.
  NFTokenOffers: string[];
}

export interface AcceptNFTOfferRequest extends BaseTransactionRequest {
  // Identifies the NFTokenOffer that offers to sell the NFToken.
  NFTokenSellOffer?: string;
  // Identifies the NFTokenOffer that offers to buy the NFToken.
  NFTokenBuyOffer?: string;
  // This field is only valid in brokered mode, and specifies the amount that the broker keeps as part of their fee for
  // bringing the two offers together; the remaining amount is sent to the seller of the NFToken being bought.
  // If specified, the fee must be such that, before applying the transfer fee, the amount that the seller would receive
  // is at least as much as the amount indicated in the sell offer.
  NFTokenBrokerFee?: Amount;
}

export interface BurnNFTRequest extends BaseTransactionRequest {
  // The NFToken to be removed by this transaction.
  NFTokenID: string;
  // The owner of the NFToken to burn. Only used if that owner is different than the account sending this transaction.
  // The issuer or authorized minter can use this field to burn NFTs that have the lsfBurnable flag enabled.
  owner?: string;
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

export interface SetAccountRequest extends BaseTransactionRequest {
  flags?: SetAccountFlags;
  // Unique identifier of a flag to disable for this account.
  clearFlag?: number;
  // The domain that owns this account, as a string of hex representing the ASCII for the domain in lowercase.
  // Cannot be more than 256 bytes in length.
  domain?: string;
  // An arbitrary 128-bit value. Conventionally, clients treat this as the md5 hash of an email address to use for
  // displaying a Gravatar image.
  emailHash?: string;
  // Public key for sending encrypted messages to this account. To set the key, it must be exactly 33 bytes, with the
  // first byte indicating the key type: 0x02 or 0x03 for secp256k1 keys, 0xED for Ed25519 keys. To remove the key, use
  // an empty value.
  messageKey?: string;
  // Another account that can mint NFTokens for you.
  NFTokenMinter?: string;
  // Integer flag to enable for this account.
  setFlag?: AccountSetAsfFlags;
  // The fee to charge when users transfer this account's tokens, represented as billionths of a unit. Cannot be more
  // than 2000000000 or less than 1000000000, except for the special case 0 meaning no fee.
  transferRate?: number;
  // Tick size to use for offers involving a currency issued by this address. The exchange rates of those offers is
  // rounded to this many significant digits. Valid values are 3 to 15 inclusive, or 0 to disable.
  tickSize?: number;
}

export interface CreateOfferRequest extends BaseTransactionRequest {
  flags?: CreateOfferFlags;
  // Time after which the Offer is no longer active, in seconds since the Ripple Epoch.
  expiration?: number;
  // An Offer to delete first, specified in the same way as OfferCancel.
  offerSequence?: number;
  // The amount and type of currency being sold.
  takerGets: Amount;
  // The amount and type of currency being bought.
  takerPays: Amount;
}

export interface CancelOfferRequest extends BaseTransactionRequest {
  // The sequence number (or Ticket number) of a previous OfferCreate transaction. If specified, cancel any offer object
  // in the ledger that was created by that transaction. It is not considered an error if the offer specified does not
  // exist.
  offerSequence: number;
}

export type RequestPayload =
  | AcceptNFTOfferRequest
  | BurnNFTRequest
  | CancelNFTOfferRequest
  | CancelOfferRequest
  | CreateNFTOfferRequest
  | CreateOfferRequest
  | GetNetworkRequest
  | GetNFTRequest
  | MintNFTRequest
  | WebsiteRequest
  | SendPaymentRequest
  | SendPaymentRequestDeprecated
  | SetAccountRequest
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
    hash: string;
  }> {}

export interface CreateNFTOfferResponse
  extends BaseResponse<{
    hash: string;
  }> {}

export interface CancelNFTOfferResponse
  extends BaseResponse<{
    hash: string;
  }> {}

export interface AcceptNFTOfferResponse
  extends BaseResponse<{
    hash: string;
  }> {}

export interface BurnNFTResponse
  extends BaseResponse<{
    hash: string;
  }> {}

export interface SetAccountResponse
  extends BaseResponse<{
    hash: string;
  }> {}

export interface CreateOfferResponse
  extends BaseResponse<{
    hash: string;
  }> {}

export interface CancelOfferResponse
  extends BaseResponse<{
    hash: string;
  }> {}

export type ResponsePayload =
  | AcceptNFTOfferResponse
  | BurnNFTResponse
  | CancelNFTOfferResponse
  | CancelOfferResponse
  | CreateNFTOfferResponse
  | CreateOfferResponse
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
  | SetAccountResponse
  | SetTrustlineResponse
  | SetTrustlineResponseDeprecated
  | SignMessageResponse
  | SignMessageResponseDeprecated;

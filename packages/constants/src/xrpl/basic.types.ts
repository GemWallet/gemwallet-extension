import {
  NFTokenMintFlagsInterface,
  PaymentFlagsInterface,
  TrustSetFlagsInterface,
  NFTokenCreateOfferFlagsInterface,
  AccountSetFlagsInterface,
  OfferCreateFlagsInterface,
  AMMDepositFlagsInterface,
  AMMWithdrawFlagsInterface
} from 'xrpl';

export interface Memo {
  memo: {
    memoType?: string;
    memoData?: string;
    memoFormat?: string;
  };
}

export interface Signer {
  signer: {
    account: string;
    txnSignature: string;
    signingPubKey: string;
  };
}

export type TrustSetFlags = TrustSetFlagsInterface | number;

export type PaymentFlags = PaymentFlagsInterface | number;

export type MintNFTFlags = NFTokenMintFlagsInterface | number;

export type CreateNFTOfferFlags = NFTokenCreateOfferFlagsInterface | number;

export type SetAccountFlags = AccountSetFlagsInterface | number;

export type CreateOfferFlags = OfferCreateFlagsInterface | number;

export type DepositAMMFlags = AMMDepositFlagsInterface | number;

export type WithdrawAMMFlags = AMMWithdrawFlagsInterface | number;

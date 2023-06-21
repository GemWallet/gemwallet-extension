import { NFTokenMintFlagsInterface, PaymentFlagsInterface, TrustSetFlagsInterface } from 'xrpl';

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

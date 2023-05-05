import { PaymentFlagsInterface, TrustSetFlagsInterface } from 'xrpl';

/**
 * Ref: https://xrpl.org/basic-data-types.html#specifying-currency-amounts
 */
export type Amount = LimitAmount | string;

export interface LimitAmount {
  // The amount to deliver
  value: string;
  // The issuer of the token
  issuer: string;
  // The token that can be used
  currency: string;
}

export interface Memo {
  memo: {
    memoType?: string;
    memoData?: string;
    memoFormat?: string;
  }
}

export type TrustSetFlags = TrustSetFlagsInterface | number;

export type PaymentFlags = PaymentFlagsInterface | number;

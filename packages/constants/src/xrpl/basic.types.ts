import { PaymentFlagsInterface, TrustSetFlagsInterface } from 'xrpl';

export interface Memo {
  memo: {
    memoType?: string;
    memoData?: string;
    memoFormat?: string;
  };
}

export type TrustSetFlags = TrustSetFlagsInterface | number;

export type PaymentFlags = PaymentFlagsInterface | number;

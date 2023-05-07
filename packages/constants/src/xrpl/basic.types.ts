import {
  PaymentFlagsInterface,
  TrustSetFlagsInterface,
  TrustSetFlags as TrustSetFlagsXRPL
} from 'xrpl';

export interface Memo {
  memo: {
    memoType?: string;
    memoData?: string;
    memoFormat?: string;
  };
}

export type TrustSetFlags = TrustSetFlagsInterface | number;

export const TrustSetFlagsBitmask = {
  tfSetfAuth: TrustSetFlagsXRPL.tfSetfAuth,
  tfSetNoRipple: TrustSetFlagsXRPL.tfSetNoRipple,
  tfClearNoRipple: TrustSetFlagsXRPL.tfClearNoRipple,
  tfSetFreeze: TrustSetFlagsXRPL.tfSetFreeze,
  tfClearFreeze: TrustSetFlagsXRPL.tfClearFreeze
};

export type PaymentFlags = PaymentFlagsInterface | number;

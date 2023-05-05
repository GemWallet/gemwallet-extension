import { Memo } from '@gemwallet/constants';

export const parseAmount = (amountString: string | null) => {
  if (!amountString) {
    return null;
  }

  try {
    const parsedAmount = JSON.parse(amountString);

    if (typeof parsedAmount === 'object' && parsedAmount !== null && 'value' in parsedAmount && 'issuer' in parsedAmount && 'currency' in parsedAmount) {
      return parsedAmount as { value: string; issuer: string; currency: string };
    }

    if (typeof parsedAmount === 'number') {
      return parsedAmount.toString();
    }
  } catch (error) {}

  return amountString;
};

export const parseMemos = (memosString: string | null) => {
  return memosString ? JSON.parse(memosString) as Memo[] : null;
};

export const parsePaymentFlags = (flagsString: string | null) => {
  if (!flagsString) {
    return null;
  }

  if (Number(flagsString)) {
    return Number(flagsString);
  }

  try {
    const parsedFlags = JSON.parse(flagsString);

    if (typeof parsedFlags === 'object' && parsedFlags !== null && ('tfNoDirectRipple' in parsedFlags || 'tfPartialPayment' in parsedFlags || 'tfLimitQuality' in parsedFlags)) {
      return parsedFlags as {
        tfNoDirectRipple?: boolean;
        tfPartialPayment?: boolean;
        tfLimitQuality?: boolean;
      }
    }
  } catch (error) {}

  return null;
};

export const parseTrustSetFlags = (flagsString: string | null) => {
  if (!flagsString) {
    return null;
  }

  if (Number(flagsString)) {
    return Number(flagsString);
  }

  try {
    const parsedFlags = JSON.parse(flagsString);

    if (typeof parsedFlags === 'object' && parsedFlags !== null && ('tfSetfAuth' in parsedFlags || 'tfSetNoRipple' in parsedFlags || 'tfClearNoRipple' in parsedFlags || 'tfSetFreeze' in parsedFlags || 'tfClearFreeze' in parsedFlags)) {
      return parsedFlags as {
        tfSetfAuth?: boolean;
        tfSetNoRipple?: boolean;
        tfClearNoRipple?: boolean;
        tfSetFreeze?: boolean;
        tfClearFreeze?: boolean;
      }
    }
  } catch (error) {}

  return null;
}

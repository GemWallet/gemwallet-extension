import { Memo } from '@gemwallet/constants';

export const parseAmount = (amountString: string | null) => {
  if (!amountString) {
    return null;
  }

  try {
    const parsedAmount = JSON.parse(amountString);

    if (
      typeof parsedAmount === 'object' &&
      parsedAmount !== null &&
      'value' in parsedAmount &&
      'issuer' in parsedAmount &&
      'currency' in parsedAmount
    ) {
      return parsedAmount as { value: string; issuer: string; currency: string };
    }

    if (typeof parsedAmount === 'number') {
      return parsedAmount.toString();
    }
  } catch (error) {}

  return amountString;
};

export const parseLimitAmount = (
  amountString: string | null,
  deprecatedAmountString: string | null,
  deprecatedCurrencyString: string | null,
  deprecatedIssuerString: string | null
) => {
  if (!amountString) {
    if (deprecatedAmountString && deprecatedCurrencyString && deprecatedIssuerString) {
      return {
        value: deprecatedAmountString,
        currency: deprecatedCurrencyString,
        issuer: deprecatedIssuerString
      };
    }

    return null;
  }

  try {
    const parsedAmount = JSON.parse(amountString);

    if (
      typeof parsedAmount === 'object' &&
      parsedAmount !== null &&
      'value' in parsedAmount &&
      'issuer' in parsedAmount &&
      'currency' in parsedAmount
    ) {
      return parsedAmount as { value: string; issuer: string; currency: string };
    }
  } catch (error) {}

  return null;
};

export const parseMemos = (memosString: string | null) => {
  if (!memosString) {
    return null;
  }

  try {
    const parsedMemos = JSON.parse(memosString);

    if (Array.isArray(parsedMemos)) {
      return parsedMemos as Memo[];
    }
  } catch (error) {}

  return null;
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

    if (
      typeof parsedFlags === 'object' &&
      parsedFlags !== null &&
      ('tfNoDirectRipple' in parsedFlags ||
        'tfPartialPayment' in parsedFlags ||
        'tfLimitQuality' in parsedFlags)
    ) {
      return parsedFlags as {
        tfNoDirectRipple?: boolean;
        tfPartialPayment?: boolean;
        tfLimitQuality?: boolean;
      };
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

    if (
      typeof parsedFlags === 'object' &&
      parsedFlags !== null &&
      ('tfSetfAuth' in parsedFlags ||
        'tfSetNoRipple' in parsedFlags ||
        'tfClearNoRipple' in parsedFlags ||
        'tfSetFreeze' in parsedFlags ||
        'tfClearFreeze' in parsedFlags)
    ) {
      return parsedFlags as {
        tfSetfAuth?: boolean;
        tfSetNoRipple?: boolean;
        tfClearNoRipple?: boolean;
        tfSetFreeze?: boolean;
        tfClearFreeze?: boolean;
      };
    }
  } catch (error) {}

  return null;
};

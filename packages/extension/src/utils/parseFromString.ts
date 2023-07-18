import {
  NFTokenCreateOfferFlags,
  NFTokenCreateOfferFlagsInterface,
  NFTokenMintFlags,
  NFTokenMintFlagsInterface,
  Transaction,
  xrpToDrops
} from 'xrpl';
import { Amount, IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common';

import {
  CreateNFTOfferFlags,
  CreateOfferFlags,
  Memo,
  MintNFTFlags,
  PaymentFlags,
  SetAccountFlags,
  Signer,
  TransactionWithID,
  TrustSetFlags
} from '@gemwallet/constants';

export const parseArray = (str: string | null): string[] | null => {
  if (!str) {
    return null;
  }

  try {
    const parsed = JSON.parse(str);

    if (Array.isArray(parsed)) {
      return parsed as string[];
    }
  } catch (error) {}

  return null;
};

export const parseAmount = (
  amountString: string | null,
  deprecatedCurrencyString: string | null,
  deprecatedIssuerString: string | null,
  messageType: string
): Amount | null => {
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
      if (deprecatedCurrencyString || deprecatedIssuerString) {
        // Since a deprecated currency or issuer has been provided, we consider the given amount to be a legacy amount
        // of a Token payment. Hence, we wrap it in an object with the deprecated currency and issuer.
        return {
          value: parsedAmount.toString(),
          currency: deprecatedCurrencyString || '',
          issuer: deprecatedIssuerString || ''
        };
      }
      if (messageType === 'SEND_PAYMENT') {
        // Deprecated way of providing a value in currency for an XRP payment.
        // Hence, we need to convert into drops.
        return xrpToDrops(parsedAmount.toString());
      }
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
): IssuedCurrencyAmount | null => {
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

export const parseMemos = (memosString: string | null): Memo[] | null => {
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

export const parseSigners = (signersString: string | null): Signer[] | null => {
  if (!signersString) {
    return null;
  }

  try {
    const parsedSigners = JSON.parse(signersString);

    if (Array.isArray(parsedSigners)) {
      return parsedSigners as Signer[];
    }
  } catch (error) {}

  return null;
};

export const parsePaymentFlags = (flagsString: string | null): PaymentFlags | null => {
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

export const parseTrustSetFlags = (flagsString: string | null): TrustSetFlags | null => {
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

export const parseSetAccountFlags = (flagsString: string | null): SetAccountFlags | null => {
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
      ('tfRequireDestTag' in parsedFlags ||
        'tfOptionalDestTag' in parsedFlags ||
        'tfRequireAuth' in parsedFlags ||
        'tfOptionalAuth' in parsedFlags ||
        'tfDisallowXRP' in parsedFlags ||
        'tfAllowXRP' in parsedFlags)
    ) {
      return parsedFlags as {
        tfRequireDestTag?: boolean;
        tfOptionalDestTag?: boolean;
        tfRequireAuth?: boolean;
        tfOptionalAuth?: boolean;
        tfDisallowXRP?: boolean;
        tfAllowXRP?: boolean;
      };
    }
  } catch (error) {}

  return null;
};

export const parseMintNFTFlags = (flagsString: string | null): MintNFTFlags | null => {
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
      ('tfBurnable' in parsedFlags ||
        'tfOnlyXRP' in parsedFlags ||
        'tfTrustLine' in parsedFlags ||
        'tfTransferable' in parsedFlags)
    ) {
      return parsedFlags as {
        tfBurnable?: boolean;
        tfOnlyXRP?: boolean;
        tfTrustLine?: boolean;
        tfTransferable?: boolean;
      };
    }
  } catch (error) {}

  return null;
};

export const parseCreateNFTOfferFlags = (
  flagsString: string | null
): CreateNFTOfferFlags | null => {
  if (!flagsString) {
    return null;
  }

  if (Number(flagsString)) {
    return Number(flagsString);
  }

  try {
    const parsedFlags = JSON.parse(flagsString);

    if (typeof parsedFlags === 'object' && parsedFlags !== null && 'tfSellNFToken' in parsedFlags) {
      return parsedFlags as {
        tfSellNFToken?: boolean;
      };
    }
  } catch (error) {}

  return null;
};

export const parseCreateOfferFlags = (flagsString: string | null): CreateOfferFlags | null => {
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
      ('tfPassive' in parsedFlags ||
        'tfImmediateOrCancel' in parsedFlags ||
        'tfFillOrKill' in parsedFlags ||
        'tfSell' in parsedFlags)
    ) {
      return parsedFlags as {
        tfPassive?: boolean;
        tfImmediateOrCancel?: boolean;
        tfFillOrKill?: boolean;
        tfSell?: boolean;
      };
    }
  } catch (error) {}

  return null;
};

export const mintNFTFlagsToNumber = (flags: NFTokenMintFlagsInterface): number => {
  let result = 0;
  if (flags.tfBurnable) {
    result |= NFTokenMintFlags.tfBurnable;
  }
  if (flags.tfOnlyXRP) {
    result |= NFTokenMintFlags.tfOnlyXRP;
  }
  if (flags.tfTrustLine) {
    result |= NFTokenMintFlags.tfTrustLine;
  }
  if (flags.tfTransferable) {
    result |= NFTokenMintFlags.tfTransferable;
  }

  return result;
};

export const createNFTOfferFlagsToNumber = (flags: NFTokenCreateOfferFlagsInterface): number => {
  let result = 0;
  if (flags.tfSellNFToken) {
    result |= NFTokenCreateOfferFlags.tfSellNFToken;
  }

  return result;
};

export const parseTransactionParam = (str: string | null): Transaction | null => {
  if (!str) {
    return null;
  }

  try {
    const parsedTransaction = JSON.parse(str);

    if (typeof parsedTransaction === 'object' && parsedTransaction !== null) {
      return parsedTransaction as Transaction;
    }
  } catch (error) {
    return null;
  }

  return null;
};

export const parseTransactionsWithIDListParam = (
  str: string | null
): TransactionWithID[] | null => {
  if (!str) {
    return null;
  }

  try {
    const parsedTransactions = JSON.parse(str);

    if (Array.isArray(parsedTransactions)) {
      return parsedTransactions.map((transaction) => transaction as TransactionWithID);
    }
  } catch (error) {
    return null;
  }

  return null;
};

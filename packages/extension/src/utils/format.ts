import { dropsToXrp, setTransactionFlagsToNumber, Transaction } from 'xrpl';
import { Amount, IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common';
import { GlobalFlags } from 'xrpl/dist/npm/models/transactions/common';

import {
  CreateNFTOfferFlags,
  CreateOfferFlags,
  MintNFTFlags,
  PaymentFlags,
  SetAccountFlags,
  TrustSetFlags
} from '@gemwallet/constants';

import { convertHexCurrencyString } from './convertHexCurrencyString';

const formatValue = (value: number) => {
  return new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'XRP',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: value.toString().split('.')[1]?.length || 0
  })
    .format(value)
    .replace(/\s?XRP\s?/, '');
};

export const formatCurrencyName = (currency: string) => {
  if (currency.length === 40) {
    // Hex representation of currency
    currency = convertHexCurrencyString(currency);
  }

  return currency.toUpperCase();
};

export const formatAmount = (amount: Amount | IssuedCurrencyAmount) => {
  let value: number;
  let currency: string;

  if (typeof amount === 'string') {
    value = Number(dropsToXrp(amount));
    currency = 'XRP';
  } else {
    if (amount.currency.length === 40) {
      // Hex representation of currency
      currency = convertHexCurrencyString(amount.currency);
    } else {
      currency = amount.currency;
    }
    value = Number(amount.value);
  }

  return `${formatValue(value)} ${currency.toUpperCase()}`;
};

export const formatToken = (value: number, currency: string = 'XRP', isDrops = false) => {
  if (isDrops) {
    value = Number(dropsToXrp(value));
  }

  return `${formatValue(value)} ${currency.toUpperCase()}`;
};

export const formatFlags = (
  flags:
    | PaymentFlags
    | TrustSetFlags
    | MintNFTFlags
    | CreateNFTOfferFlags
    | SetAccountFlags
    | CreateOfferFlags
    | GlobalFlags
) => {
  if (typeof flags === 'object') {
    return Object.entries(flags)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  } else {
    return flags;
  }
};

export const formatFlagsToNumber = (tx: Transaction) => {
  if (typeof tx.Flags === 'number') {
    return tx.Flags;
  }

  const txCopy = { ...tx };
  setTransactionFlagsToNumber(txCopy);
  return txCopy.Flags;
};

export const formatTransferFee = (fee: number) => {
  return fee / 1000;
};

// When we display some strings to the UI, we want to make sure that they are not too long and will not break the UI.
// To do so, we truncate the string only if:
// - There is one word with a length bigger than the given length
// otherwise, we return the string as is.
// We do not need to truncate the string if there is no word with a length bigger than the given length because in this
// case, the string will be correctly displayed in multiple lines, and will not break the UI.
export const truncateStringOnLongWord = (str: string, length: number) => {
  // If the length of the given string is lower than the length, return it
  if (str.length <= length) {
    return str;
  }

  // If there is a word with a length bigger than the given length, return the string truncated
  const words = str.split(' ');
  const longWordExists = words.some((word) => word.length > length);
  if (longWordExists) {
    return str.substring(0, length) + '...';
  }

  return str;
};

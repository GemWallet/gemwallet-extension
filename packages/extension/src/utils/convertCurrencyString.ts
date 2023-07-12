import { Amount, IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common';

import { currencyToHex } from './hexConverter';

export const convertCurrencyString = (currency: string): string => {
  if (currency.length !== 40) {
    return currency;
  }
  // Split the currency string into two-character codes and convert them to corresponding characters using their hexadecimal values
  const currencyChars = currency.match(/.{2}/g);
  if (!currencyChars) {
    return currency;
  }
  return currencyChars.map((charCode) => String.fromCharCode(parseInt(charCode, 16))).join('');
};

export const handleAmountHexCurrency = (amount: Amount | IssuedCurrencyAmount) => {
  if (
    amount &&
    typeof amount === 'object' &&
    amount.currency.length > 3 &&
    amount.currency.length !== 40
  ) {
    amount.currency = currencyToHex(amount.currency);
  }
};

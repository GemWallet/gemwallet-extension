import { Amount, IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common';

import { currencyToHex } from './hexConverter';
import { isLPToken, LP_TOKEN } from './trustlines';

export const convertHexCurrencyString = (hexCurrency: string): string => {
  if (hexCurrency.length !== 40) {
    return hexCurrency;
  }

  if (isLPToken(hexCurrency)) {
    return LP_TOKEN;
  }

  // Trim trailing zeros in the hex string
  hexCurrency = hexCurrency.toLowerCase().replace(/0+$/, '');

  // Convert hex to Buffer and then to ASCII
  return Buffer.from(hexCurrency, 'hex').toString('ascii');
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

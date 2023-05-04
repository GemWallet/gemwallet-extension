import { dropsToXrp } from 'xrpl';
import { Amount as AmountXRPL } from 'xrpl/dist/npm/models/common';

import { Amount } from '@gemwallet/constants';

export const formatAmount = (amount: Amount | AmountXRPL) => {
  let value: number;
  let currency: string;

  if (typeof amount === 'string') {
    value = Number(dropsToXrp(amount));
    currency = 'XRP';
  } else {
    value = Number(amount.value);
    currency = amount.currency;
  }

  return `${new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'XRP',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: value.toString().split('.')[1]?.length || 0
  })
    .format(value)
    .replace(/\s?XRP\s?/, '')} ${currency.toUpperCase()}`;
};

export const formatToken = (value: number, currency: string | undefined = 'XRP', isDrops: boolean = false) => {
  if (isDrops) {
    value = Number(dropsToXrp(value))
  }

  return `${new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'XRP',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: value.toString().split('.')[1]?.length || 0
  })
    .format(value)
    .replace(/\s?XRP\s?/, '')} ${currency.toUpperCase()}`;
};

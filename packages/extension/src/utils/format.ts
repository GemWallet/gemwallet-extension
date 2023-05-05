import { dropsToXrp } from 'xrpl';
import { Amount } from 'xrpl/dist/npm/models/common';

import { PaymentFlags, TrustSetFlags } from '@gemwallet/constants';

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

export const formatAmount = (amount: Amount) => {
  let value: number;
  let currency: string;

  if (typeof amount === 'string') {
    value = Number(dropsToXrp(amount));
    currency = 'XRP';
  } else {
    value = Number(amount.value);
    currency = amount.currency;
  }

  return `${formatValue(value)} ${currency.toUpperCase()}`;
};

export const formatToken = (value: number, currency: string = 'XRP', isDrops = false) => {
  if (isDrops) {
    value = Number(dropsToXrp(value));
  }

  return `${formatValue(value)} ${currency.toUpperCase()}`;
};

export const formatFlags = (flags: PaymentFlags | TrustSetFlags) => {
  if (typeof flags === 'object') {
    return Object.entries(flags)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  } else {
    return flags;
  }
};

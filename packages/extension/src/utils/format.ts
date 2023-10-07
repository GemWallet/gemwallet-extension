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
  let decimalLength = value.toString().split('.')[1]?.length || 0;
  decimalLength = Math.min(Math.max(decimalLength, 0), 6);

  return new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'XRP',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: decimalLength
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

const LABEL_OFFER_TYPE = 'Offer type';
const LABEL_SELL_OFFER = 'Sell offer';
const LABEL_BUY_OFFER = 'Buy offer';
const LABEL_BURNABLE = 'Burnable';
const LABEL_ONLY_XRP = 'Only XRP';
const LABEL_MINT_TF_TRUSTLINE = 'tfTrustLine';
const LABEL_TRANSFERABLE = 'Transferable';
export const formatFlags = (
  flags:
    | PaymentFlags
    | TrustSetFlags
    | MintNFTFlags
    | CreateNFTOfferFlags
    | SetAccountFlags
    | CreateOfferFlags
    | GlobalFlags,
  flagsType?: 'NFTokenCreateOffer' | 'NFTokenMint' | string
) => {
  if (flagsType === 'NFTokenCreateOffer') {
    if (typeof flags === 'number') {
      if (flags & 0x00000001) {
        return `${LABEL_OFFER_TYPE}: ${LABEL_SELL_OFFER}`;
      }
      if (flags & 0x00000000) {
        return `${LABEL_OFFER_TYPE}: ${LABEL_BUY_OFFER}`;
      }
    }

    if (typeof flags === 'object') {
      return Object.entries(flags)
        .map(([key, value]) => {
          if (key === 'tfSellNFToken') {
            return `${LABEL_OFFER_TYPE}: ${value ? LABEL_SELL_OFFER : LABEL_BUY_OFFER}`;
          }
          return `${key}: ${value}`;
        })
        .join('\n');
    }
  }

  if (flagsType === 'NFTokenMint') {
    if (typeof flags === 'number') {
      let flagDescriptions: string[] = [];

      if (flags & 0x00000001) {
        flagDescriptions.push(LABEL_BURNABLE);
      }
      if (flags & 0x00000002) {
        flagDescriptions.push(LABEL_ONLY_XRP);
      }
      if (flags & 0x00000004) {
        flagDescriptions.push(LABEL_MINT_TF_TRUSTLINE);
      }
      if (flags & 0x00000008) {
        flagDescriptions.push(LABEL_TRANSFERABLE);
      }
      return flagDescriptions.join('\n');
    }

    if (typeof flags === 'object') {
      return Object.entries(flags)
        .map(([key, value]) => {
          if (key === 'tfBurnable' && value) {
            return `${LABEL_BURNABLE}`;
          }
          if (key === 'tfOnlyXRP' && value) {
            return `${LABEL_ONLY_XRP}`;
          }
          if (key === 'tfTrustLine' && value) {
            return `${LABEL_MINT_TF_TRUSTLINE}`;
          }
          if (key === 'tfTransferable' && value) {
            return `${LABEL_TRANSFERABLE}`;
          }
          if (['tfBurnable', 'tfOnlyXRP', 'tfTrustLine', 'tfTransferable'].includes(key)) {
            return null;
          }
          return `${key}: ${value}`;
        })
        .filter((flag) => flag !== null)
        .join('\n');
    }
  }

  // Fallback
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

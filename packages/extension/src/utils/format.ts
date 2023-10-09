import {
  dropsToXrp,
  NFTokenCreateOfferFlags,
  NFTokenMintFlags,
  OfferCreateFlags,
  setTransactionFlagsToNumber,
  Transaction,
  TrustSetFlags as TrustSetFlagsBitmask,
  PaymentFlags as PaymentFlagsBitmask,
  AccountSetTfFlags as AccountSetTfFlagsBitmask
} from 'xrpl';
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

export const formatAmount = (amount: Amount | IssuedCurrencyAmount, showIssuer?: boolean) => {
  let value: number;
  let currency: string;
  let issuer: string | undefined;

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
    issuer = amount.issuer;
  }

  const formattedValue = `${formatValue(value)} ${currency.toUpperCase()}`;
  return showIssuer && issuer ? `${formattedValue}\nIssuer: ${issuer}` : formattedValue;
};

export const formatToken = (value: number, currency: string = 'XRP', isDrops = false) => {
  if (isDrops) {
    value = Number(dropsToXrp(value));
  }

  return `${formatValue(value)} ${currency.toUpperCase()}`;
};

// NFTokenCreateOffer
const LABEL_OFFER_TYPE = 'Offer type';
const LABEL_SELL_OFFER = 'Sell offer';
const LABEL_BUY_OFFER = 'Buy offer';
// NFTokenMint
const LABEL_BURNABLE = 'Burnable';
const LABEL_ONLY_XRP = 'Only XRP';
const LABEL_MINT_TF_TRUSTLINE = 'Create trustline (deprecated)';
const LABEL_TRANSFERABLE = 'Transferable';
// OfferCreate
const LABEL_PASSIVE = 'Passive';
const LABEL_IMMEDIATE_OR_CANCEL = 'Immediate Or Cancel';
const LABEL_FILL_OR_KILL = 'Fill Or Kill';
const LABEL_SELL = 'Sell';
// Payment
const LABEL_NO_DIRECT_RIPPLE = 'No Direct Ripple';
const LABEL_PARTIAL_PAYMENT = 'Partial Payment';
const LABEL_LIMIT_QUALITY = 'Limit Quality';
// AccountSet
const LABEL_REQUIRE_DEST_TAG = 'Require Dest Tag';
const LABEL_OPTIONAL_DEST_TAG = 'Optional Dest Tag';
const LABEL_REQUIRE_AUTH = 'Require Auth';
const LABEL_OPTIONAL_AUTH = 'Optional Auth';
const LABEL_DISALLOW_XRP = 'Disallow XRP';
const LABEL_ALLOW_XRP = 'Allow XRP';
// TrustSet
const LABEL_SET_AUTH = 'Set Auth';
const LABEL_SET_NO_RIPPLE = 'Set No Ripple';
const LABEL_CLEAR_NO_RIPPLE = 'Clear No Ripple';
const LABEL_SET_FREEZE = 'Set Freeze';
const LABEL_CLEAR_FREEZE = 'Clear Freeze';
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
      if (flags & NFTokenCreateOfferFlags.tfSellNFToken) {
        return `${LABEL_OFFER_TYPE}: ${LABEL_SELL_OFFER}`;
      }
      if (flags & 0x00000000) {
        return `${LABEL_OFFER_TYPE}: ${LABEL_BUY_OFFER}`;
      }
    }

    if (typeof flags === 'object') {
      const formattedFlags = Object.entries(flags)
        .map(([key, value]) => {
          if (key === 'tfSellNFToken') {
            return `${LABEL_OFFER_TYPE}: ${value ? LABEL_SELL_OFFER : LABEL_BUY_OFFER}`;
          }
          return `${key}: ${value}`;
        })
        .filter((flag) => flag !== null);

      return formattedFlags.length > 0 ? formattedFlags.join('\n') : 'None';
    }
  }

  if (flagsType === 'NFTokenMint') {
    if (typeof flags === 'number') {
      let flagDescriptions: string[] = [];

      if (flags & NFTokenMintFlags.tfBurnable) {
        flagDescriptions.push(LABEL_BURNABLE);
      }
      if (flags & NFTokenMintFlags.tfOnlyXRP) {
        flagDescriptions.push(LABEL_ONLY_XRP);
      }
      if (flags & NFTokenMintFlags.tfTrustLine) {
        flagDescriptions.push(LABEL_MINT_TF_TRUSTLINE);
      }
      if (flags & NFTokenMintFlags.tfTransferable) {
        flagDescriptions.push(LABEL_TRANSFERABLE);
      }
      return flagDescriptions.join('\n');
    }

    if (typeof flags === 'object') {
      const formattedFlags = Object.entries(flags)
        .map(([key, value]: [key: string, value: boolean]) => {
          if (key === 'tfBurnable' && value) {
            return LABEL_BURNABLE;
          }
          if (key === 'tfOnlyXRP' && value) {
            return LABEL_ONLY_XRP;
          }
          if (key === 'tfTrustLine' && value) {
            return LABEL_MINT_TF_TRUSTLINE;
          }
          if (key === 'tfTransferable' && value) {
            return LABEL_TRANSFERABLE;
          }
          if (['tfBurnable', 'tfOnlyXRP', 'tfTrustLine', 'tfTransferable'].includes(key)) {
            return null;
          }
          return `${key}: ${value}`;
        })
        .filter((flag) => flag !== null);

      return formattedFlags.length > 0 ? formattedFlags.join('\n') : 'None';
    }
  }

  if (flagsType === 'OfferCreate') {
    if (typeof flags === 'number') {
      let flagDescriptions: string[] = [];

      if (flags & OfferCreateFlags.tfPassive) {
        flagDescriptions.push(LABEL_PASSIVE);
      }
      if (flags & OfferCreateFlags.tfImmediateOrCancel) {
        flagDescriptions.push(LABEL_IMMEDIATE_OR_CANCEL);
      }
      if (flags & OfferCreateFlags.tfFillOrKill) {
        flagDescriptions.push(LABEL_FILL_OR_KILL);
      }
      if (flags & OfferCreateFlags.tfSell) {
        flagDescriptions.push(LABEL_SELL);
      }

      return flagDescriptions.join('\n');
    }

    if (typeof flags === 'object') {
      return Object.entries(flags)
        .map(([key, value]) => {
          if (key === 'tfPassive' && value) {
            return LABEL_PASSIVE;
          }
          if (key === 'tfImmediateOrCancel' && value) {
            return LABEL_IMMEDIATE_OR_CANCEL;
          }
          if (key === 'tfFillOrKill' && value) {
            return LABEL_FILL_OR_KILL;
          }
          if (key === 'tfSell' && value) {
            return LABEL_SELL;
          }
          if (['tfPassive', 'tfImmediateOrCancel', 'tfFillOrKill', 'tfSell'].includes(key)) {
            return null;
          }
          return `${key}: ${value}`;
        })
        .filter((flag) => flag !== null)
        .join('\n');
    }
  }

  if (flagsType === 'Payment') {
    if (typeof flags === 'number') {
      let flagDescriptions: string[] = [];

      if (flags & PaymentFlagsBitmask.tfNoDirectRipple) {
        flagDescriptions.push(LABEL_NO_DIRECT_RIPPLE);
      }
      if (flags & PaymentFlagsBitmask.tfPartialPayment) {
        flagDescriptions.push(LABEL_PARTIAL_PAYMENT);
      }
      if (flags & PaymentFlagsBitmask.tfLimitQuality) {
        flagDescriptions.push(LABEL_LIMIT_QUALITY);
      }

      return flagDescriptions.join('\n');
    }

    if (typeof flags === 'object') {
      const formattedFlags = Object.entries(flags)
        .map(([key, value]) => {
          if (key === 'tfNoDirectRipple' && value) {
            return `${LABEL_NO_DIRECT_RIPPLE}`;
          }
          if (key === 'tfPartialPayment' && value) {
            return `${LABEL_PARTIAL_PAYMENT}`;
          }
          if (key === 'tfLimitQuality' && value) {
            return `${LABEL_LIMIT_QUALITY}`;
          }
          if (['tfNoDirectRipple', 'tfPartialPayment', 'tfLimitQuality'].includes(key)) {
            return null;
          }
          return `${key}: ${value}`;
        })
        .filter((flag) => flag !== null);

      return formattedFlags.length > 0 ? formattedFlags.join('\n') : 'None';
    }
  }

  if (flagsType === 'AccountSet') {
    if (typeof flags === 'number') {
      let flagDescriptions: string[] = [];

      if (flags & AccountSetTfFlagsBitmask.tfRequireDestTag) {
        flagDescriptions.push(LABEL_REQUIRE_DEST_TAG);
      }
      if (flags & AccountSetTfFlagsBitmask.tfOptionalDestTag) {
        flagDescriptions.push(LABEL_OPTIONAL_DEST_TAG);
      }
      if (flags & AccountSetTfFlagsBitmask.tfRequireAuth) {
        flagDescriptions.push(LABEL_REQUIRE_AUTH);
      }
      if (flags & AccountSetTfFlagsBitmask.tfOptionalAuth) {
        flagDescriptions.push(LABEL_OPTIONAL_AUTH);
      }
      if (flags & AccountSetTfFlagsBitmask.tfDisallowXRP) {
        flagDescriptions.push(LABEL_DISALLOW_XRP);
      }
      if (flags & AccountSetTfFlagsBitmask.tfAllowXRP) {
        flagDescriptions.push(LABEL_ALLOW_XRP);
      }

      return flagDescriptions.length > 0 ? flagDescriptions.join('\n') : 'None';
    }

    if (typeof flags === 'object') {
      const formattedFlags = Object.entries(flags)
        .map(([key, value]) => {
          if (key === 'tfRequireDestTag' && value) {
            return `${LABEL_REQUIRE_DEST_TAG}`;
          }
          if (key === 'tfOptionalDestTag' && value) {
            return `${LABEL_OPTIONAL_DEST_TAG}`;
          }
          if (key === 'tfRequireAuth' && value) {
            return `${LABEL_REQUIRE_AUTH}`;
          }
          if (key === 'tfOptionalAuth' && value) {
            return `${LABEL_OPTIONAL_AUTH}`;
          }
          if (key === 'tfDisallowXRP' && value) {
            return `${LABEL_DISALLOW_XRP}`;
          }
          if (key === 'tfAllowXRP' && value) {
            return `${LABEL_ALLOW_XRP}`;
          }
          if (
            [
              'tfRequireDestTag',
              'tfOptionalDestTag',
              'tfRequireAuth',
              'tfOptionalAuth',
              'tfDisallowXRP',
              'tfAllowXRP'
            ].includes(key)
          ) {
            return null;
          }
          return `${key}: ${value}`;
        })
        .filter((flag) => flag !== null);

      return formattedFlags.length > 0 ? formattedFlags.join('\n') : 'None';
    }
  }

  if (flagsType === 'TrustSet') {
    if (typeof flags === 'number') {
      let flagDescriptions: string[] = [];

      if (flags & TrustSetFlagsBitmask.tfSetfAuth) {
        flagDescriptions.push(LABEL_SET_AUTH);
      }
      if (flags & TrustSetFlagsBitmask.tfSetNoRipple) {
        flagDescriptions.push(LABEL_SET_NO_RIPPLE);
      }
      if (flags & TrustSetFlagsBitmask.tfClearNoRipple) {
        flagDescriptions.push(LABEL_CLEAR_NO_RIPPLE);
      }
      if (flags & TrustSetFlagsBitmask.tfSetFreeze) {
        flagDescriptions.push(LABEL_SET_FREEZE);
      }
      if (flags & TrustSetFlagsBitmask.tfClearFreeze) {
        flagDescriptions.push(LABEL_CLEAR_FREEZE);
      }

      return flagDescriptions.length > 0 ? flagDescriptions.join('\n') : 'None';
    }

    if (typeof flags === 'object') {
      const formattedFlags = Object.entries(flags)
        .map(([key, value]) => {
          if (key === 'tfSetfAuth' && value) {
            return `${LABEL_SET_AUTH}`;
          }
          if (key === 'tfSetNoRipple' && value) {
            return `${LABEL_SET_NO_RIPPLE}`;
          }
          if (key === 'tfClearNoRipple' && value) {
            return `${LABEL_CLEAR_NO_RIPPLE}`;
          }
          if (key === 'tfSetFreeze' && value) {
            return `${LABEL_SET_FREEZE}`;
          }
          if (key === 'tfClearFreeze' && value) {
            return `${LABEL_CLEAR_FREEZE}`;
          }
          if (
            [
              'tfSetfAuth',
              'tfSetNoRipple',
              'tfClearNoRipple',
              'tfSetFreeze',
              'tfClearFreeze'
            ].includes(key)
          ) {
            return null;
          }
          return `${key}: ${value}`;
        })
        .filter((flag) => flag !== null);

      return formattedFlags.length > 0 ? formattedFlags.join('\n') : 'None';
    }
  }

  // Fallback
  if (typeof flags === 'object') {
    const formattedFlags = Object.entries(flags)
      .map(([key, value]) => `${key}: ${value}`)
      .filter((flag) => flag !== null);
    return formattedFlags.length > 0 ? formattedFlags.join('\n') : 'None';
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

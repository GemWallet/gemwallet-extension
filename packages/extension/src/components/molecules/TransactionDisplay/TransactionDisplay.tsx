import { FC } from 'react';

import { TypographyProps } from '@mui/material';
import { convertHexToString, Currency } from 'xrpl';
import { Amount, Memo, Signer } from 'xrpl/dist/npm/models/common';
import { GlobalFlags } from 'xrpl/dist/npm/models/transactions/common';

import { Hook, Transaction } from '@gemwallet/constants';

import { useWallet } from '../../../contexts';
import {
  convertHexCurrencyString,
  formatFlags,
  formatTransferFee,
  parseAmountObject
} from '../../../utils';
import { KeyValueDisplay } from '../../atoms';
import { HooksDisplay } from './HooksDisplay';

type XRPLTxProps = {
  tx: Transaction;
  displayTransactionType?: boolean;
  useLegacy?: boolean;
  hasMultipleAmounts?: boolean;
  mainToken?: string;
};

export const TransactionDisplay: FC<XRPLTxProps> = ({
  tx,
  displayTransactionType = true,
  useLegacy = true,
  hasMultipleAmounts = false,
  mainToken
}) => {
  const { selectedWallet, wallets } = useWallet();
  const keyMap: Record<string, (value: any) => JSX.Element | null> = {
    TransactionType: (value: string) =>
      renderSimpleText({
        title: 'Transaction Type',
        value,
        useLegacy
      }),
    Amount: (value: Amount) =>
      renderAmount({
        title: 'Amount',
        value,
        useLegacy,
        mainToken,
        hasMultipleAmounts
      }),
    Amount2: (value: Amount) =>
      renderAmount({
        title: 'Amount 2',
        value,
        useLegacy,
        hasMultipleAmounts
      }),
    Account: (value: string) =>
      wallets[selectedWallet].publicAddress === value
        ? null
        : renderSimpleText({ title: 'Account', value, hasTooltip: true, useLegacy }),
    NFTokenID: (value: string) =>
      renderSimpleText({ title: 'NFT', value, hasTooltip: true, useLegacy }),
    DeliverMin: (value: Amount) =>
      renderAmount({
        title: 'Deliver Min',
        value,
        useLegacy
      }),
    Destination: (value: string) =>
      renderSimpleText({ title: 'Destination', value, hasTooltip: true, useLegacy }),
    DestinationTag: (value?: number) =>
      renderSimpleText({ title: 'Destination Tag', value, useLegacy }),
    Flags: (value?: GlobalFlags) =>
      value !== undefined
        ? renderSimpleText({
            title: 'Flags',
            value: formatFlags(value, tx.TransactionType),
            useLegacy
          })
        : null,
    Memos: (value?: Memo[]) => renderMemos({ memos: value, useLegacy }),
    NFTokenOffers: (value: string[]) => renderArray({ title: 'Offer', value, useLegacy }),
    Signers: (value?: Signer[]) => renderArray({ title: 'Signer', value, useLegacy }),
    LimitAmount: (value) =>
      renderAmount({
        title: 'Limit Amount',
        value: value as Amount,
        useLegacy,
        mainToken
      }),
    NFTokenSellOffer: (value?: string) =>
      value !== undefined ? renderSimpleText({ title: 'Sell Offer', value, useLegacy }) : null,
    NFTokenBuyOffer: (value?: string) =>
      value !== undefined ? renderSimpleText({ title: 'Buy Offer', value, useLegacy }) : null,
    NFTokenBrokerFee: (value?: Amount) =>
      value !== undefined
        ? renderAmount({ title: 'Broker Fee', value, useLegacy, mainToken })
        : null,
    NFTokenMinter: (value?: string) =>
      value !== undefined ? renderSimpleText({ title: 'Minter', value, useLegacy }) : null,
    URI: (value?: string | null) =>
      value !== undefined
        ? renderSimpleText({
            title: 'URI',
            value: value ? convertHexToString(value as string) : '',
            hasTooltip: true,
            useLegacy
          })
        : null,
    Fee: () => null, // Fee is rendered in the BaseTransaction component
    TakerGets: (value: Amount) =>
      renderAmount({ title: 'Taker Gets', value, useLegacy, mainToken }),
    TakerPays: (value: Amount) =>
      renderAmount({ title: 'Taker Pays', value, useLegacy, mainToken }),
    TransferFee: (value?: number) =>
      renderSimpleText({
        title: 'Transfer Fee',
        value: value ? `${formatTransferFee(value)}%` : '',
        useLegacy
      }),
    OfferSequence: (value?: number) =>
      renderSimpleText({ title: 'Offer Sequence', value, useLegacy }),
    EmailHash: (value?: string) => renderSimpleText({ title: 'Email Hash', value, useLegacy }),
    NFTokenTaxon: (value?: string) => renderSimpleText({ title: 'Taxon', value, useLegacy }),
    RegularKey: (value?: string) =>
      renderSimpleText({ title: 'Regular Key', value, hasTooltip: true, useLegacy }),
    Asset: (value: Currency) => renderCurrency({ title: 'Asset', value }),
    Asset2: (value: Currency) => renderCurrency({ title: 'Asset 2', value }),
    SendMax: (value: Amount) =>
      renderAmount({
        title: 'Send Max',
        value,
        useLegacy
      }),
    Hooks: (value?: Hook[]) => renderHooks({ hooks: value })
  };

  const renderSimpleText = (params: {
    title: string;
    value: any;
    hasTooltip?: boolean;
    useLegacy: boolean;
  }): JSX.Element | null => {
    const { title, value, hasTooltip } = params;

    if (value === undefined) {
      return null;
    }

    return (
      <KeyValueDisplay
        keyName={title}
        value={String(value)}
        hasTooltip={hasTooltip}
        useLegacy={useLegacy}
      />
    );
  };

  const renderCurrency = (params: { title: string; value: Currency }) => {
    const { title, value } = params;
    const currency = convertHexCurrencyString(value.currency);
    const formatted = value.issuer ? `${currency}\n${value.issuer}` : currency;
    const hasTooltip = !!value.issuer;
    return (
      <KeyValueDisplay
        keyName={title}
        value={formatted}
        useLegacy={useLegacy}
        hasTooltip={hasTooltip}
      />
    );
  };

  const renderAmount = (params: {
    title: string;
    value: Amount;
    valueTypographyProps?: TypographyProps;
    useLegacy: boolean;
    hasMultipleAmounts?: boolean;
    mainToken?: string;
  }) => {
    const { title, value, valueTypographyProps, useLegacy } = params;
    const res = parseAmountObject(value, mainToken);
    if (hasMultipleAmounts) {
      const formattedValue = res.issuer
        ? `${res.amount} ${res.currency}\n${res.issuer}`
        : `${res.amount} ${res.currency}`;

      const hasTooltip = !!res.issuer;

      return (
        <KeyValueDisplay
          keyName={title}
          value={formattedValue}
          valueTypographyProps={valueTypographyProps}
          useLegacy={useLegacy}
          hasTooltip={hasTooltip}
        />
      );
    }

    return (
      <>
        <KeyValueDisplay
          keyName={title}
          value={`${res.amount} ${res.currency}`}
          valueTypographyProps={valueTypographyProps}
          useLegacy={useLegacy}
        />
        {res.issuer ? (
          <KeyValueDisplay
            keyName="Trustline"
            value={res.issuer}
            valueTypographyProps={valueTypographyProps}
            hasTooltip={true}
            useLegacy={useLegacy}
          />
        ) : null}
      </>
    );
  };

  const renderHooks = (params: { hooks: Hook[] | undefined }) => {
    return <HooksDisplay hooks={params.hooks ?? []} fontSize={12} />;
  };

  const renderMemos = (params: { memos?: Memo[]; useLegacy: boolean }) => {
    const { memos, useLegacy } = params;
    if (memos === undefined || memos.length === 0) {
      return null;
    }

    return (
      <>
        {memos.map((memo, index) => {
          const memoData = memo.Memo.MemoData
            ? Buffer.from(memo.Memo.MemoData, 'hex').toString('utf8')
            : memo.Memo.MemoData;

          return (
            <KeyValueDisplay
              key={index}
              keyName={memos.length > 1 ? `Memo ${index + 1}` : 'Memo'}
              value={memoData || ''}
              useLegacy={useLegacy}
              hasTooltip={true}
            />
          );
        })}
      </>
    );
  };

  const renderArray = (params: { title: string; value: unknown; useLegacy: boolean }) => {
    const { title, value } = params;

    if (!Array.isArray(value)) {
      return renderSimpleText({ title, value: JSON.stringify(value), useLegacy });
    }

    return (
      <>
        {value.map((val, index) => {
          return (
            <KeyValueDisplay
              key={index}
              keyName={value.length > 1 ? `${title} ${index + 1}` : title}
              value={val}
              useLegacy={useLegacy}
              hasTooltip={true}
            />
          );
        })}
      </>
    );
  };

  const renderKeys = (useLegacy: boolean) => {
    // Ensure the order of the fields to be displayed
    // The keys that are not in this array will be displayed at the end in the order they appear in the tx object
    const order = [
      'TransactionType',
      'Amount',
      'Asset',
      'Amount2',
      'Asset2',
      'LimitAmount',
      'Hooks',
      'NFTokenID',
      'NFTokenOffers',
      'TakerGets',
      'TakerPays',
      'Destination',
      'DestinationTag',
      'DeliverMin',
      'SendMax',
      'NFTokenSellOffer',
      'NFTokenBuyOffer',
      'NFTokenBrokerFee',
      'URI',
      'NFTokenMinter',
      'OfferSequence',
      'RegularKey',
      'Signers',
      'Flags',
      'TransferFee',
      'NFTokenTaxon',
      'Memos'
    ];

    const orderedEntries = Object.entries(tx).sort(([aKey], [bKey]) => {
      const aIndex = order.indexOf(aKey);
      const bIndex = order.indexOf(bKey);
      if (aIndex === -1 && bIndex === -1) return 0; // preserve original order for keys not in order array
      if (aIndex === -1) return 1; // aKey not in order array, bKey wins
      if (bIndex === -1) return -1; // bKey not in order array, aKey wins
      return aIndex - bIndex; // both in order array, compare their indices
    });

    return orderedEntries.map(([key, value]) => {
      // Do not display empty values
      if (value === undefined || value === null) {
        return null;
      }

      if (key === 'TransactionType' && !displayTransactionType) {
        return null;
      }

      // Known keys
      if (keyMap[key]) {
        return keyMap[key](value);
      }

      // Fallback
      let displayValue: string;
      if (typeof value === 'object') {
        displayValue = JSON.stringify(value);
      } else {
        displayValue = String(value);
      }

      return <KeyValueDisplay keyName={key} value={displayValue} useLegacy={useLegacy} />;
    });
  };

  return <>{renderKeys(useLegacy)}</>;
};

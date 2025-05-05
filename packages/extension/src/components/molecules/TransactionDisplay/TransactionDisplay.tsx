import { FC } from 'react';

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
  const keyMap: Record<string, (value: unknown) => JSX.Element | null> = {
    TransactionType: (value) =>
      renderSimpleText({
        title: 'Transaction Type',
        value: value as string,
        useLegacy
      }),
    Amount: (value) =>
      renderAmount({
        title: 'Amount',
        value: value as Amount,
        useLegacy,
        mainToken,
        hasMultipleAmounts
      }),
    Amount2: (value) =>
      renderAmount({
        title: 'Amount 2',
        value: value as Amount,
        useLegacy,
        hasMultipleAmounts
      }),
    Account: (value) =>
      wallets[selectedWallet].publicAddress === value
        ? null
        : renderSimpleText({
            title: 'Account',
            value: value as string,
            hasTooltip: true,
            useLegacy
          }),
    NFTokenID: (value) =>
      renderSimpleText({ title: 'NFT', value: value as string, hasTooltip: true, useLegacy }),
    DeliverMin: (value) =>
      renderAmount({
        title: 'Deliver Min',
        value: value as Amount,
        useLegacy
      }),
    Destination: (value) =>
      renderSimpleText({
        title: 'Destination',
        value: value as string,
        hasTooltip: true,
        useLegacy
      }),
    DestinationTag: (value?) =>
      renderSimpleText({ title: 'Destination Tag', value: value as number | undefined, useLegacy }),
    Flags: (value?) =>
      value !== undefined
        ? renderSimpleText({
            title: 'Flags',
            value: formatFlags(value as GlobalFlags, tx.TransactionType),
            useLegacy
          })
        : null,
    Memos: (value?) => renderMemos({ memos: value as Memo[] | undefined, useLegacy }),
    NFTokenOffers: (value) => renderArray({ title: 'Offer', value: value as string[], useLegacy }),
    Signers: (value?) =>
      renderArray({ title: 'Signer', value: value as Signer[] | undefined, useLegacy }),
    LimitAmount: (value) =>
      renderAmount({
        title: 'Limit Amount',
        value: value as Amount,
        useLegacy,
        mainToken
      }),
    NFTokenSellOffer: (value?) =>
      value !== undefined
        ? renderSimpleText({ title: 'Sell Offer', value: value as string, useLegacy })
        : null,
    NFTokenBuyOffer: (value?) =>
      value !== undefined
        ? renderSimpleText({ title: 'Buy Offer', value: value as string, useLegacy })
        : null,
    NFTokenBrokerFee: (value?) =>
      value !== undefined
        ? renderAmount({ title: 'Broker Fee', value: value as Amount, useLegacy, mainToken })
        : null,
    NFTokenMinter: (value?) =>
      value !== undefined
        ? renderSimpleText({ title: 'Minter', value: value as string | undefined, useLegacy })
        : null,
    URI: (value?) =>
      value !== undefined
        ? renderSimpleText({
            title: 'URI',
            value: value ? convertHexToString(value as string) : '',
            hasTooltip: true,
            useLegacy
          })
        : null,
    Fee: () => null, // Fee is rendered in the BaseTransaction component
    TakerGets: (value) =>
      renderAmount({ title: 'Taker Gets', value: value as Amount, useLegacy, mainToken }),
    TakerPays: (value) =>
      renderAmount({ title: 'Taker Pays', value: value as Amount, useLegacy, mainToken }),
    TransferFee: (value?) =>
      renderSimpleText({
        title: 'Transfer Fee',
        value: value ? `${formatTransferFee(value as number)}%` : '',
        useLegacy
      }),
    OfferSequence: (value?) =>
      renderSimpleText({ title: 'Offer Sequence', value: value as number | undefined, useLegacy }),
    EmailHash: (value?) =>
      renderSimpleText({ title: 'Email Hash', value: value as string | undefined, useLegacy }),
    NFTokenTaxon: (value?) =>
      renderSimpleText({ title: 'Taxon', value: value as string | undefined, useLegacy }),
    RegularKey: (value?) =>
      renderSimpleText({
        title: 'Regular Key',
        value: value as string | undefined,
        hasTooltip: true,
        useLegacy
      }),
    Asset: (value) => renderCurrency({ title: 'Asset', value: value as Currency }),
    Asset2: (value) => renderCurrency({ title: 'Asset 2', value: value as Currency }),
    SendMax: (value) =>
      renderAmount({
        title: 'Send Max',
        value: value as Amount,
        useLegacy
      }),
    Hooks: (value?) => renderHooks({ hooks: value as Hook[] | undefined })
  };

  const renderSimpleText = (params: {
    title: string;
    value: string | number | undefined;
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
    useLegacy: boolean;
    hasMultipleAmounts?: boolean;
    mainToken?: string;
  }) => {
    const { title, value, useLegacy } = params;
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
          useLegacy={useLegacy}
        />
        {res.issuer ? (
          <KeyValueDisplay
            keyName="Trustline"
            value={res.issuer}
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

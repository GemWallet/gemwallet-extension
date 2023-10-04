import { FC } from 'react';

import { Tooltip, Typography, TypographyProps } from '@mui/material';
import { convertHexToString, Transaction } from 'xrpl';
import { Amount, Memo, Signer } from 'xrpl/dist/npm/models/common';
import { GlobalFlags } from 'xrpl/dist/npm/models/transactions/common';

import { formatAmount, formatFlags, formatTransferFee } from '../../../utils';

type XRPLTxProps = {
  tx: Transaction;
};

interface KeyValueDisplayProps {
  keyName: string;
  value: string;
  keyTypographyProps?: TypographyProps;
  valueTypographyProps?: TypographyProps;
  hasTooltip?: boolean;
}

const valueTypoStyle = {
  marginBottom: '10px'
};

const KeyValueDisplay: FC<KeyValueDisplayProps> = ({
  keyName,
  value,
  keyTypographyProps,
  valueTypographyProps,
  hasTooltip
}) => (
  <>
    <Typography {...keyTypographyProps}>{keyName}:</Typography>
    {hasTooltip ? (
      <Tooltip title={value}>
        <Typography {...valueTypographyProps} style={valueTypoStyle}>
          <pre style={{ margin: 0, color: 'white', fontFamily: 'Arial, sans-serif' }}>{value}</pre>
        </Typography>
      </Tooltip>
    ) : (
      <Typography {...valueTypographyProps} style={valueTypoStyle}>
        <pre style={{ margin: 0, color: 'white', fontFamily: 'Arial, sans-serif' }}>{value}</pre>
      </Typography>
    )}
  </>
);

export const DisplayXRPLTransaction: FC<XRPLTxProps> = ({ tx }) => {
  const largeValueTypoStyle = {
    fontSize: '1.2rem'
  };

  const keyMap: Record<string, (value: any) => JSX.Element | null> = {
    TransactionType: (value: string) =>
      renderSimpleText({
        title: 'Transaction Type',
        value,
        valueTypographyProps: largeValueTypoStyle
      }),
    Amount: (value: Amount) =>
      renderAmount({
        title: 'Amount',
        value,
        valueTypographyProps: largeValueTypoStyle
      }),
    Account: (value: string) => renderSimpleText({ title: 'Account', value, hasTooltip: true }),
    NFTokenID: (value: string) => renderSimpleText({ title: 'NFT Token ID', value }),
    Destination: (value: string) =>
      renderSimpleText({ title: 'Destination', value, hasTooltip: true }),
    DestinationTag: (value?: number) => renderSimpleText({ title: 'Destination Tag', value }),
    Flags: (value?: GlobalFlags) =>
      value !== undefined ? renderSimpleText({ title: 'Flags', value: formatFlags(value) }) : null,
    Memos: (value?: Memo[]) => renderMemos(value),
    NFTokenOffers: (value: string[]) => renderArray({ title: 'Offer IDs', value }),
    Signers: (value?: Signer[]) => renderArray({ title: 'Signers', value }),
    LimitAmount: (value) => renderAmount({ title: 'Limit Amount', value: value as Amount }),
    NFTokenSellOffer: (value?: string) =>
      value !== undefined ? renderSimpleText({ title: 'NFT Token Sell Offer', value }) : null,
    NFTokenBuyOffer: (value?: string) =>
      value !== undefined ? renderSimpleText({ title: 'NFT Token Buy Offer', value }) : null,
    NFTokenBrokerFee: (value?: Amount) =>
      value !== undefined ? renderAmount({ title: 'NFT Token Broker Fee', value }) : null,
    NFTokenMinter: (value?: string) =>
      value !== undefined ? renderSimpleText({ title: 'NFT Token Minter', value }) : null,
    URI: (value?: string | null) =>
      value !== undefined
        ? renderSimpleText({
            title: 'URI',
            value: value ? convertHexToString(value as string) : '',
            hasTooltip: true
          })
        : null,
    Fee: () => null, // Fee is rendered in the BaseTransaction component
    TakerGets: (value: Amount) => renderAmount({ title: 'Taker Gets', value }),
    TakerPays: (value: Amount) => renderAmount({ title: 'Taker Pays', value }),
    TransferFee: (value?: number) =>
      renderSimpleText({
        title: 'Transfer Fee',
        value: value ? `${formatTransferFee(value)}%` : ''
      })
  };

  const renderSimpleText = (params: {
    title: string;
    value: any;
    hasTooltip?: boolean;
    valueTypographyProps?: TypographyProps;
  }): JSX.Element | null => {
    const { title, value, hasTooltip, valueTypographyProps } = params;

    if (value === undefined) {
      return null;
    }

    return (
      <KeyValueDisplay
        keyName={title}
        value={String(value)}
        hasTooltip={hasTooltip}
        valueTypographyProps={valueTypographyProps}
      />
    );
  };

  const renderAmount = (params: {
    title: string;
    value: Amount;
    valueTypographyProps?: TypographyProps;
  }) => {
    const { title, value, valueTypographyProps } = params;

    return (
      <KeyValueDisplay
        keyName={title}
        value={formatAmount(value)}
        valueTypographyProps={valueTypographyProps}
      />
    );
  };

  const renderMemos = (memos?: Memo[]) => {
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
            <KeyValueDisplay key={index} keyName={`Memo ${index + 1}`} value={memoData || ''} />
          );
        })}
      </>
    );
  };

  const renderArray = (params: { title: string; value: unknown }) => {
    const { title, value } = params;

    if (!Array.isArray(value)) {
      return renderSimpleText({ title, value: JSON.stringify(value) });
    }

    return (
      <KeyValueDisplay
        keyName={title}
        value={value.map((offer) => JSON.stringify(offer)).join(', ')}
      />
    );
  };

  const renderKeys = () => {
    // Ensure the order of the fields to be displayed
    // The keys that are not in this array will be displayed at the end in the order they appear in the tx object
    const order = [
      'TransactionType',
      'Amount',
      'LimitAmount',
      'NFTokenID',
      'NFTokenOffers',
      'TakerGets',
      'TakerPays',
      'Destination',
      'DestinationTag',
      'NFTokenSellOffer',
      'NFTokenBuyOffer',
      'NFTokenBrokerFee',
      'URI',
      'NFTokenMinter',
      'Signers',
      'Flags',
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
      // Do not display null values
      if (!value) {
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

      return <KeyValueDisplay keyName={key} value={displayValue} />;
    });
  };

  return <>{renderKeys()}</>;
};

export default DisplayXRPLTransaction;

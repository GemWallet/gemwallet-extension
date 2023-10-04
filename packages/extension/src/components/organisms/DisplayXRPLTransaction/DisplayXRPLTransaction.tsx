import { FC } from 'react';

import { Paper, Tooltip, Typography, TypographyProps } from '@mui/material';
import { convertHexToString, Transaction } from 'xrpl';
import { Amount, Memo, Signer } from 'xrpl/dist/npm/models/common';
import { GlobalFlags } from 'xrpl/dist/npm/models/transactions/common';

import { formatAmount, formatFlags, formatTransferFee } from '../../../utils';

type XRPLTxProps = {
  tx: Transaction;
  useLegacy?: boolean;
};

interface KeyValueDisplayProps {
  keyName: string;
  value: string;
  keyTypographyProps?: TypographyProps;
  valueTypographyProps?: TypographyProps;
  hasTooltip?: boolean;
  useLegacy?: boolean;
}

const valueTypoStyle = {
  marginBottom: '10px'
};

const KeyValueDisplay: FC<KeyValueDisplayProps> = ({
  keyName,
  value,
  keyTypographyProps,
  valueTypographyProps,
  hasTooltip,
  useLegacy
}) => {
  if (useLegacy) {
    return (
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography {...keyTypographyProps}>{keyName}:</Typography>
        {hasTooltip ? (
          <Tooltip title={value}>
            <Typography {...valueTypographyProps} style={valueTypoStyle}>
              <pre
                style={{
                  margin: 0,
                  color: 'white',
                  fontFamily: 'Arial, sans-serif',
                  maxWidth: '100%', // Set your max-width here
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {value}
              </pre>
            </Typography>
          </Tooltip>
        ) : (
          <Typography {...valueTypographyProps} style={valueTypoStyle}>
            <pre
              style={{
                margin: 0,
                color: 'white',
                fontFamily: 'Arial, sans-serif',
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {value}
            </pre>
          </Typography>
        )}
      </Paper>
    );
  }

  return (
    <>
      <Typography {...keyTypographyProps}>{keyName}:</Typography>
      {hasTooltip ? (
        <Tooltip title={value}>
          <Typography {...valueTypographyProps} style={valueTypoStyle}>
            <pre style={{ margin: 0, color: 'white', fontFamily: 'Arial, sans-serif' }}>
              {value}
            </pre>
          </Typography>
        </Tooltip>
      ) : (
        <Typography {...valueTypographyProps} style={valueTypoStyle}>
          <pre style={{ margin: 0, color: 'white', fontFamily: 'Arial, sans-serif' }}>{value}</pre>
        </Typography>
      )}
    </>
  );
};

export const DisplayXRPLTransaction: FC<XRPLTxProps> = ({ tx, useLegacy = true }) => {
  const largeValueTypoStyle = {
    fontSize: '1.2rem'
  };

  const keyMap: Record<string, (value: any) => JSX.Element | null> = {
    TransactionType: (value: string) =>
      renderSimpleText({
        title: 'Transaction Type',
        value,
        valueTypographyProps: largeValueTypoStyle,
        useLegacy
      }),
    Amount: (value: Amount) =>
      renderAmount({
        title: 'Amount',
        value,
        valueTypographyProps: largeValueTypoStyle,
        useLegacy
      }),
    Account: (value: string) =>
      renderSimpleText({ title: 'Account', value, hasTooltip: true, useLegacy }),
    NFTokenID: (value: string) => renderSimpleText({ title: 'NFT Token ID', value, useLegacy }),
    Destination: (value: string) =>
      renderSimpleText({ title: 'Destination', value, hasTooltip: true, useLegacy }),
    DestinationTag: (value?: number) =>
      renderSimpleText({ title: 'Destination Tag', value, useLegacy }),
    Flags: (value?: GlobalFlags) =>
      value !== undefined
        ? renderSimpleText({ title: 'Flags', value: formatFlags(value), useLegacy })
        : null,
    Memos: (value?: Memo[]) => renderMemos({ memos: value, useLegacy }),
    NFTokenOffers: (value: string[]) => renderArray({ title: 'Offer IDs', value, useLegacy }),
    Signers: (value?: Signer[]) => renderArray({ title: 'Signers', value, useLegacy }),
    LimitAmount: (value) =>
      renderAmount({ title: 'Limit Amount', value: value as Amount, useLegacy }),
    NFTokenSellOffer: (value?: string) =>
      value !== undefined
        ? renderSimpleText({ title: 'NFT Token Sell Offer', value, useLegacy })
        : null,
    NFTokenBuyOffer: (value?: string) =>
      value !== undefined
        ? renderSimpleText({ title: 'NFT Token Buy Offer', value, useLegacy })
        : null,
    NFTokenBrokerFee: (value?: Amount) =>
      value !== undefined
        ? renderAmount({ title: 'NFT Token Broker Fee', value, useLegacy })
        : null,
    NFTokenMinter: (value?: string) =>
      value !== undefined
        ? renderSimpleText({ title: 'NFT Token Minter', value, useLegacy })
        : null,
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
    TakerGets: (value: Amount) => renderAmount({ title: 'Taker Gets', value, useLegacy }),
    TakerPays: (value: Amount) => renderAmount({ title: 'Taker Pays', value, useLegacy }),
    TransferFee: (value?: number) =>
      renderSimpleText({
        title: 'Transfer Fee',
        value: value ? `${formatTransferFee(value)}%` : '',
        useLegacy
      })
  };

  const renderSimpleText = (params: {
    title: string;
    value: any;
    hasTooltip?: boolean;
    valueTypographyProps?: TypographyProps;
    useLegacy: boolean;
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
        useLegacy={useLegacy}
      />
    );
  };

  const renderAmount = (params: {
    title: string;
    value: Amount;
    valueTypographyProps?: TypographyProps;
    useLegacy: boolean;
  }) => {
    const { title, value, valueTypographyProps } = params;

    return (
      <KeyValueDisplay
        keyName={title}
        value={formatAmount(value)}
        valueTypographyProps={valueTypographyProps}
        useLegacy={useLegacy}
      />
    );
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
              keyName={`Memo ${index + 1}`}
              value={memoData || ''}
              useLegacy={useLegacy}
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
      <KeyValueDisplay
        keyName={title}
        value={value.map((offer) => JSON.stringify(offer)).join(', ')}
        useLegacy={useLegacy}
      />
    );
  };

  const renderKeys = (useLegacy: boolean) => {
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

      return <KeyValueDisplay keyName={key} value={displayValue} useLegacy={useLegacy} />;
    });
  };

  return <>{renderKeys(useLegacy)}</>;
};

export default DisplayXRPLTransaction;

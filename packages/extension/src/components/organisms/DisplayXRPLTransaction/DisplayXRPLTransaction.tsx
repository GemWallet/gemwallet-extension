import { FC } from 'react';

import { Paper, Tooltip, Typography } from '@mui/material';
import { convertHexToString, Transaction } from 'xrpl';
import { Amount, Memo } from 'xrpl/dist/npm/models/common';
import { GlobalFlags } from 'xrpl/dist/npm/models/transactions/common';

import { formatAmount, formatFlags, formatTransferFee } from '../../../utils';

type XRPLTxProps = {
  tx: Transaction;
};

export const DisplayXRPLTransaction: FC<XRPLTxProps> = ({ tx }) => {
  const keyMap: Record<string, (value: unknown) => JSX.Element> = {
    TransactionType: (value) => renderSimpleText('Transaction Type', value),
    Amount: (value) => renderAmount('Amount', value as Amount),
    NFTokenID: (value) => renderSimpleText('NFT Token ID', value),
    Destination: (value) => renderSimpleText('Destination', value),
    DestinationTag: (value) => renderSimpleText('Destination Tag', value),
    Flags: (value) => renderSimpleText('Flags', formatFlags(value as GlobalFlags)),
    Memos: (value) => renderMemos(value as Memo[]),
    NFTokenOffers: (value) => renderArray('Offer IDs', value),
    Signers: (value) => renderArray('Signers', value),
    LimitAmount: (value) => renderAmount('Limit Amount', value as Amount),
    NFTokenSellOffer: (value) => renderSimpleText('NFT Token Sell Offer', value),
    NFTokenBuyOffer: (value) => renderSimpleText('NFT Token Buy Offer', value),
    NFTokenBrokerFee: (value) => renderAmount('NFT Token Broker Fee', value as Amount),
    NFTokenMinter: (value) => renderSimpleText('NFT Token Minter', value),
    URI: (value) => renderSimpleText('URI', value ? convertHexToString(value as string) : '', true),
    Fee: () => <></>, // Fee is rendered in the BaseTransaction component
    TakerGets: (value) => renderAmount('Taker Gets', value as Amount),
    TakerPays: (value) => renderAmount('Taker Pays', value as Amount),
    TransferFee: (value) =>
      renderSimpleText('Transfer Fee', value ? `${formatTransferFee(value as number)}%` : '')
  };

  const renderSimpleText = (title: string, value: unknown, tooltip?: boolean) => {
    const strValue = String(value);
    const typo = (
      <Typography
        variant="body2"
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%'
        }}
      >
        <pre style={{ margin: 0 }}>{strValue}</pre>
      </Typography>
    );
    return (
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography variant="body1">{title}:</Typography>
        {tooltip ? <Tooltip title={strValue}>{typo}</Tooltip> : typo}
      </Paper>
    );
  };

  const renderAmount = (title: string, value: Amount) => (
    <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
      <Typography variant="body1">{title}:</Typography>
      <Typography variant="h6" component="h1" align="right">
        {formatAmount(value)}
      </Typography>
    </Paper>
  );

  const renderMemos = (memos: Memo[]) => (
    <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
      <Typography variant="body1">Memos:</Typography>
      {memos.map((memo, index) => (
        <div key={index} style={{ marginBottom: index === memos.length - 1 ? 0 : '8px' }}>
          <Typography
            variant="body2"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%'
            }}
          >
            {memo.Memo.MemoData
              ? Buffer.from(memo.Memo.MemoData, 'hex').toString('utf8')
              : memo.Memo.MemoData}
          </Typography>
        </div>
      ))}
    </Paper>
  );

  const renderArray = (title: string, value: unknown) => {
    if (!Array.isArray(value)) {
      return renderSimpleText(title, JSON.stringify(value));
    }

    return (
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography variant="body1">{title}:</Typography>
        {value.map((offer, index) => (
          <div key={index} style={{ marginBottom: index === value.length - 1 ? 0 : '8px' }}>
            <Typography
              variant="body2"
              style={{
                wordBreak: 'break-word'
              }}
            >
              {offer}
            </Typography>
          </div>
        ))}
      </Paper>
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

      return (
        <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
          <Typography variant="body1">{key}:</Typography>
          <Typography variant="body2">
            <pre style={{ margin: 0 }}>{displayValue}</pre>
          </Typography>
        </Paper>
      );
    });
  };

  return <>{renderKeys()}</>;
};

export default DisplayXRPLTransaction;

import React, { useState } from 'react';

import { Typography, Card, CardMedia } from '@mui/material';
import { Amount } from 'xrpl/dist/npm/models/common';

import { TransactionWithID } from '@gemwallet/constants';

import { formatAmount } from '../../../../utils';
import { DataCard, RawTransaction } from '../../../molecules';

interface TransactionsDisplayProps {
  transactionsToDisplay: Record<number, TransactionWithID>;
  txNFTData: Record<number, any>;
  collapsed: boolean;
  renderKey: number;
}

export const TransactionsDisplay: React.FC<TransactionsDisplayProps> = ({
  transactionsToDisplay,
  txNFTData,
  collapsed,
  renderKey
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <DataCard
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      paddingTop={0}
      alwaysExpand={true}
      formattedData={
        <>
          {Object.entries(transactionsToDisplay || {}).map(([key, tx]) => {
            const { ID, ...txWithoutID } = tx;
            return (
              <div key={key} style={{ marginBottom: '20px' }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  style={{ marginTop: '5px', fontSize: '1.1em' }}
                >
                  {Number(key) + 1} - {tx.TransactionType}
                </Typography>
                {'Amount' in txWithoutID && txWithoutID.Amount ? (
                  <Typography variant="body2" color="textSecondary">
                    {formatAmount(txWithoutID.Amount)}
                  </Typography>
                ) : null}
                {txNFTData[Number(key)] && txNFTData[Number(key)].amount ? (
                  <Typography variant="body2" color="textSecondary">
                    {formatAmount(txNFTData[Number(key)].amount as Amount)}
                  </Typography>
                ) : null}
                {txNFTData[Number(key)] && txNFTData[Number(key)].name ? (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{
                      marginTop: '5px',
                      fontWeight: 'lighter',
                      fontStyle: 'italic',
                      fontSize: '0.9em'
                    }}
                  >
                    {txNFTData[Number(key)].name}
                  </Typography>
                ) : null}
                {txNFTData[Number(key)] && txNFTData[Number(key)].image ? (
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                    <Card sx={{ maxWidth: 300 }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={txNFTData[Number(key)].image}
                        alt="NFT Image"
                      />
                    </Card>
                  </div>
                ) : null}
                <RawTransaction
                  transaction={txWithoutID}
                  collapsed={collapsed}
                  key={renderKey}
                  fontSize={12}
                />
              </div>
            );
          })}
        </>
      }
    />
  );
};

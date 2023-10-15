import React, { FC, useMemo, useState } from 'react';

import { Typography, Card, CardMedia, Button } from '@mui/material';
import { Amount } from 'xrpl/dist/npm/models/common';

import { TransactionWithID } from '@gemwallet/constants';

import { formatAmount } from '../../../../utils';
import { DataCard, RawTransaction, XRPLTransaction } from '../../../molecules';

interface TransactionsDisplayProps {
  transactionsToDisplay: Record<number, TransactionWithID>;
  txNFTData: Record<number, any>;
}

export const TransactionsDisplay: FC<TransactionsDisplayProps> = ({
  transactionsToDisplay,
  txNFTData
}) => {
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({});
  const [areAllExpanded, setAreAllExpanded] = useState<boolean>(false);

  const transactions = useMemo(
    () => Object.entries(transactionsToDisplay || {}),
    [transactionsToDisplay]
  );

  const handleToggleExpand = (key: string) => {
    setExpandedStates((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleExpandCollapseAll = () => {
    const newState = !areAllExpanded;
    setAreAllExpanded(newState);

    const updatedExpandedStates = transactions.reduce((acc, [key]) => {
      acc[key] = newState;
      return acc;
    }, {} as Record<string, boolean>);

    setExpandedStates(updatedExpandedStates);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleExpandCollapseAll}
        style={{
          marginTop: '20px',
          marginBottom: '20px',
          padding: '6px 12px',
          fontSize: '0.875em'
        }}
      >
        {areAllExpanded ? 'Collapse All' : 'Expand All'}
      </Button>
      {transactions.map(([key, tx], index) => {
        const { ID, ...txWithoutID } = tx;
        return (
          <DataCard
            dataName={`${Number(key) + 1} - ${tx.TransactionType}`}
            isExpanded={expandedStates[key] ?? areAllExpanded}
            setIsExpanded={() => handleToggleExpand(key)}
            paddingTop={10}
            formattedData={
              <div key={key} style={{ marginBottom: '20px' }}>
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
                <XRPLTransaction
                  tx={txWithoutID}
                  displayTransactionType={false}
                  useLegacy={false}
                />
                <RawTransaction
                  transaction={txWithoutID}
                  fontSize={12}
                  collapsed={true}
                  title="Raw Transaction"
                />
              </div>
            }
          />
        );
      })}
    </>
  );
};

import React, { FC, useMemo, useState } from 'react';

import { Button } from '@mui/material';

import { TransactionWithID } from '@gemwallet/constants';

import { useMainToken } from '../../../../hooks';
import {
  DataCard,
  RawTransaction,
  TransactionNFTDisplay,
  TxNFTData,
  XRPLTransaction
} from '../../../molecules';

interface TransactionsDisplayProps {
  transactionsToDisplay: Record<number, TransactionWithID>;
  txNFTData: Record<number, TxNFTData>;
}

export const TransactionsDisplay: FC<TransactionsDisplayProps> = ({
  transactionsToDisplay,
  txNFTData
}) => {
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({});
  const [areAllExpanded, setAreAllExpanded] = useState<boolean>(false);
  const mainToken = useMainToken();

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
                {txNFTData[Number(key)] ? (
                  <TransactionNFTDisplay nftData={txNFTData[Number(key)]} />
                ) : null}
                <XRPLTransaction
                  tx={txWithoutID}
                  displayTransactionType={false}
                  useLegacy={false}
                  mainToken={mainToken}
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

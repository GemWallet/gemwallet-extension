import React from 'react';

import { Button, Typography } from '@mui/material';

import { TransactionWithID } from '@gemwallet/constants';

import { Fee } from '../../../organisms';

interface RecapProps {
  transactionsListParam: TransactionWithID[] | null;
  estimatedFees: any;
  errorFees: any;
  handleReject: () => void;
  beginProcess: () => void;
}

const RecapView: React.FC<RecapProps> = ({
  transactionsListParam,
  estimatedFees,
  errorFees,
  handleReject,
  beginProcess
}) => {
  const getTransactionCountsByType = () => {
    return transactionsListParam?.reduce<{ [key: string]: number }>((acc, { transaction }) => {
      const type = transaction.TransactionType;
      if (!acc[type]) {
        acc[type] = 1;
      } else {
        acc[type] += 1;
      }
      return acc;
    }, {});
  };

  return (
    <>
      <Typography variant="h6">Recap:</Typography>
      <Typography variant="body1">
        Number of transactions: {transactionsListParam?.length}
      </Typography>
      {Object.entries(getTransactionCountsByType() || {}).map(([type, count]) => (
        <Typography key={type} variant="body1">
          {type}: {count}
        </Typography>
      ))}
      <Fee errorFees={errorFees} estimatedFees={estimatedFees} fee={null} />
      <Button variant="contained" color="primary" onClick={beginProcess}>
        Begin
      </Button>
      <Button variant="contained" color="secondary" onClick={handleReject}>
        Cancel
      </Button>
    </>
  );
};

export default RecapView;

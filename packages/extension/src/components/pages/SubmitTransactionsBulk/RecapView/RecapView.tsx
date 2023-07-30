import React from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, Paper, Typography } from '@mui/material';

import { TransactionWithID } from '@gemwallet/constants';

import { ERROR_RED } from '../../../../constants';
import { Fee } from '../../../organisms';
import { PageWithTitle } from '../../../templates';

interface RecapProps {
  transactionsListParam: TransactionWithID[] | null;
  estimatedFees: any;
  errorFees: any;
  hasEnoughFunds: boolean;
  handleReject: () => void;
  beginProcess: () => void;
}

export const RecapView: React.FC<RecapProps> = ({
  transactionsListParam,
  estimatedFees,
  errorFees,
  hasEnoughFunds,
  handleReject,
  beginProcess
}) => {
  const getTransactionCountsByType = () => {
    return transactionsListParam?.reduce<{ [key: string]: number }>((acc, transaction) => {
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
    <PageWithTitle title="Bulk Transactions" styles={{ container: { justifyContent: 'initial' } }}>
      <div style={{ marginBottom: '40px' }}>
        {!hasEnoughFunds ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ErrorIcon style={{ color: ERROR_RED }} />
            <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
              Insufficient funds.
            </Typography>
          </div>
        ) : null}
        <div style={{ marginTop: '5px', marginBottom: '15px' }}>
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
            You are about to submit multiple transactions in bulk. Please find the recap below.
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
            In the next steps, you will be able to review each transaction individually, before
            submitting all of them at once.
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
            Please take a moment to review the transactions before submitting them. Only submit bulk
            transactions from third parties you trust.
          </Typography>
        </div>
        <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
          <Typography variant="body1">Total number of transactions:</Typography>
          <Typography
            variant="body2"
            style={{
              wordBreak: 'break-word'
            }}
          >
            {transactionsListParam?.length}
          </Typography>
        </Paper>
        <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
          <Typography variant="body1">Types of transactions:</Typography>
          {Object.entries(getTransactionCountsByType() || {}).map(([type, count]) => (
            <Typography
              variant="body2"
              style={{
                wordBreak: 'break-word'
              }}
            >
              {type}: {count}
            </Typography>
          ))}
        </Paper>
        <Fee errorFees={errorFees} estimatedFees={estimatedFees} fee={null} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1d1d1d'
          }}
        >
          <Container style={{ display: 'flex', justifyContent: 'space-evenly', margin: '10px' }}>
            <Button variant="contained" color="secondary" onClick={handleReject}>
              Reject
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={beginProcess}
              disabled={!hasEnoughFunds}
            >
              Begin
            </Button>
          </Container>
        </div>
      </div>
    </PageWithTitle>
  );
};

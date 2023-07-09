import React, { FC, useMemo } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common';

import { ERROR_RED } from '../../../constants';
import { formatAmount, fromHexMemos } from '../../../utils';
import { BaseTransaction } from '../../organisms/BaseTransaction/BaseTransaction';
import { PageWithTitle } from '../../templates';
import { Params } from './AddNewTrustline';

interface StepConfirmProps {
  params: Params;
  estimatedFees: string;
  errorFees: string;
  hasEnoughFunds: boolean;
  onReject: () => void;
  onConfirm: () => void;
}

export const StepConfirm: FC<StepConfirmProps> = ({
  params,
  estimatedFees,
  errorFees,
  hasEnoughFunds,
  onReject,
  onConfirm
}) => {
  const limitAmount = params.limitAmount as IssuedCurrencyAmount;
  const memos = useMemo(() => fromHexMemos(params.memos ?? undefined) ?? [], [params.memos]);

  return (
    <PageWithTitle title="Add Trustline - Confirm">
      {!hasEnoughFunds ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Tooltip title="You need more funds on your wallet to proceed">
            <IconButton size="small">
              <ErrorIcon style={{ color: ERROR_RED }} />
            </IconButton>
          </Tooltip>
          <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
            Insufficient funds.
          </Typography>
        </div>
      ) : null}
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography variant="body1">Issuer:</Typography>
        <Typography variant="body2">{limitAmount.issuer}</Typography>
      </Paper>
      <Paper
        elevation={24}
        style={{
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '5px'
        }}
      >
        <Typography variant="body1">Currency:</Typography>
        <Typography variant="body1">{limitAmount.currency}</Typography>
      </Paper>
      <Paper
        elevation={24}
        style={{
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '5px'
        }}
      >
        <Typography variant="body1">Limit:</Typography>
        <Typography variant="body1">{formatAmount(limitAmount)}</Typography>
      </Paper>
      <div style={{ marginBottom: '40px' }}>
        <BaseTransaction
          fee={params.fee ? Number(params.fee) : null}
          memos={memos}
          flags={params.flags}
          errorFees={errorFees}
          estimatedFees={estimatedFees}
        />
      </div>
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
          <Button variant="contained" color="secondary" onClick={onReject}>
            Reject
          </Button>
          <Button variant="contained" onClick={onConfirm} disabled={!hasEnoughFunds}>
            Confirm
          </Button>
        </Container>
      </div>
    </PageWithTitle>
  );
};

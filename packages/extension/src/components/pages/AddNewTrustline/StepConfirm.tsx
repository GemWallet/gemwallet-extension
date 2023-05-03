import React, { FC } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material';

import { ERROR_RED } from '../../../constants';
import { formatToken } from '../../../utils';
import { TileLoader } from '../../atoms';
import { PageWithTitle } from '../../templates';

interface StepConfirmProps {
  issuer: string | null;
  currency: string | null;
  value: string | null;
  fee: string | null;
  estimatedFees: string;
  errorFees: string;
  hasEnoughFunds: boolean;
  defaultFee: string;
  onReject: () => void;
  onConfirm: () => void;
}

export const StepConfirm: FC<StepConfirmProps> = ({
  issuer,
  currency,
  value,
  fee,
  estimatedFees,
  errorFees,
  hasEnoughFunds,
  defaultFee,
  onReject,
  onConfirm,
}) => (
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
    <Paper elevation={24} style={{ padding: '10px' }}>
      <Typography variant="body1">Issuer:</Typography>
      <Typography variant="body2">{issuer}</Typography>
    </Paper>
    <Paper
      elevation={24}
      style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}
    >
      <Typography variant="body1">Currency:</Typography>
      <Typography variant="body1">{currency}</Typography>
    </Paper>

    <Paper
      elevation={24}
      style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}
    >
      <Typography variant="body1">Limit:</Typography>
      <Typography variant="body1">{formatToken(Number(value), currency || undefined)}</Typography>
    </Paper>
    <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
      <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="These are the fees to make the transaction over the network">
          <IconButton size="small">
            <ErrorIcon />
          </IconButton>
        </Tooltip>
        Network fees:
      </Typography>
      <Typography variant="body2" gutterBottom align="right">
        {errorFees ? (
          <Typography variant="caption" style={{ color: ERROR_RED }}>
            {errorFees}
          </Typography>
        ) : estimatedFees === defaultFee ? (
          <TileLoader secondLineOnly />
        ) : (
          fee ? formatToken(Number(fee), 'XRP (manual)', true) : formatToken(Number(estimatedFees), 'XRP', true)
        )}
      </Typography>
    </Paper>
    <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
      <Button variant="contained" color="secondary" onClick={onReject}>
        Reject
      </Button>
      <Button variant="contained" onClick={onConfirm} disabled={!hasEnoughFunds}>
        Confirm
      </Button>
    </Container>
  </PageWithTitle>
);

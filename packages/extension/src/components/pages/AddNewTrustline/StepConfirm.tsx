import React, { FC } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common';

import { Memo, TrustSetFlags } from '@gemwallet/constants';

import { ERROR_RED } from '../../../constants';
import { formatAmount, formatFlags, formatToken } from '../../../utils';
import { TileLoader } from '../../atoms';
import { PageWithTitle } from '../../templates';

interface StepConfirmProps {
  limitAmount: IssuedCurrencyAmount;
  fee: string | null;
  memos: Memo[];
  flags: TrustSetFlags | null;
  estimatedFees: string;
  errorFees: string;
  hasEnoughFunds: boolean;
  defaultFee: string;
  onReject: () => void;
  onConfirm: () => void;
}

export const StepConfirm: FC<StepConfirmProps> = ({
  limitAmount,
  fee,
  memos,
  flags,
  estimatedFees,
  errorFees,
  hasEnoughFunds,
  defaultFee,
  onReject,
  onConfirm
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
    {memos.length > 0 ? (
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography variant="body1">Memos:</Typography>
        {memos.map((memo, index) => (
          <div
            key={index}
            style={{
              marginBottom: index === memos.length - 1 ? 0 : '8px'
            }}
          >
            <Typography
              variant="body2"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}
            >
              {memo.memo.memoData}
            </Typography>
          </div>
        ))}
      </Paper>
    ) : null}
    <Paper
      elevation={24}
      style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}
    >
      <Typography variant="body1">Prevent Rippling:</Typography>
      <Typography variant="body1">{noRipple ? 'Yes' : 'No'}</Typography>
    </Paper>
    {flags ? (
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography variant="body1">Flags:</Typography>
        <Typography variant="body2">
          <pre style={{ margin: 0 }}>{formatFlags(flags)}</pre>
        </Typography>
      </Paper>
    ) : null}
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
        ) : fee ? (
          formatToken(Number(fee), 'XRP (manual)', true)
        ) : (
          formatAmount(estimatedFees)
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

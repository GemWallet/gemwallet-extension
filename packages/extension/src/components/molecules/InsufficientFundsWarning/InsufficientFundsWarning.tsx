import React, { FC } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Typography } from '@mui/material';

import { ERROR_RED } from '../../../constants';

export interface InsufficientFundsWarningProps {
  hasEnoughFunds: boolean;
}

export const InsufficientFundsWarning: FC<InsufficientFundsWarningProps> = ({ hasEnoughFunds }) => {
  if (hasEnoughFunds) return null;

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}
    >
      <ErrorIcon style={{ color: ERROR_RED }} />
      <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
        Insufficient funds.
      </Typography>
    </div>
  );
};

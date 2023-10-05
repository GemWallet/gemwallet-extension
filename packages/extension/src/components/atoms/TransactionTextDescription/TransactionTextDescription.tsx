import { FC } from 'react';

import { Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../constants';

export interface TransactionTextDescriptionProps {
  text: string;
}

export const TransactionTextDescription: FC<TransactionTextDescriptionProps> = ({ text }) => {
  return <Typography style={{ color: SECONDARY_GRAY, marginTop: '20px' }}>{text}</Typography>;
};

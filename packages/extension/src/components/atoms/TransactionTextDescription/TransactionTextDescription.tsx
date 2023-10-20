import { FC } from 'react';

import { Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../constants';

export interface TransactionTextDescriptionProps {
  text: string | string[];
}

export const TransactionTextDescription: FC<TransactionTextDescriptionProps> = ({ text }) => {
  if (typeof text === 'string') {
    return <Typography style={{ color: SECONDARY_GRAY, marginTop: '20px' }}>{text}</Typography>;
  }

  return (
    <>
      {text.map((paragraph, index) => (
        <Typography
          key={index}
          style={{ color: SECONDARY_GRAY, marginTop: index === 0 ? '20px' : '5px' }}
        >
          {paragraph}
        </Typography>
      ))}
    </>
  );
};

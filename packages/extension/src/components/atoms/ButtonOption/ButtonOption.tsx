import { FC } from 'react';

import { Check as CheckIcon } from '@mui/icons-material';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../constants';

export interface ButtonOptionProps {
  name: string;
  description: string;
  isSelected?: boolean;
  onClick: () => void;
}

export const ButtonOption: FC<ButtonOptionProps> = ({
  name,
  description,
  isSelected = false,
  onClick
}) => {
  return (
    <Card
      style={{
        marginBottom: '20px'
      }}
      onClick={onClick}
    >
      <CardActionArea>
        <CardContent
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'initial',
            border: `solid ${isSelected ? '#FFFFFF' : SECONDARY_GRAY}`
          }}
        >
          <Box>
            <Typography gutterBottom>{name}</Typography>
            <Typography variant="subtitle2" color={SECONDARY_GRAY}>
              {description}
            </Typography>
          </Box>
          {isSelected ? <CheckIcon /> : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

import { FC } from 'react';

import { Check as CheckIcon } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../../constants';

interface NetworkDisplayProps {
  name: string;
  server: string;
  description: string;
  isSelected?: boolean;
  onClick: () => void;
  onRemove?: () => void;
}

export const NetworkDisplay: FC<NetworkDisplayProps> = ({
  name,
  server,
  description,
  isSelected = false,
  onClick,
  onRemove
}) => {
  return (
    <Card
      style={{
        marginBottom: '20px'
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardContent
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box>
            <Typography gutterBottom>{name}</Typography>
            <Typography variant="subtitle2" color={SECONDARY_GRAY}>
              {server}
            </Typography>
            <Typography style={{ marginTop: '10px' }} variant="body2" color={SECONDARY_GRAY}>
              {description}
            </Typography>
          </Box>
          {onRemove && (
            <div
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
              }}
              style={{ cursor: 'pointer' }}
            >
              <DeleteIcon />
            </div>
          )}
          {isSelected ? <CheckIcon /> : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

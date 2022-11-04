import { CSSProperties, FC } from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Paper, Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../constants';
import { formatToken } from '../../../utils';
import { Xrp } from '../../atoms';
import { IconTextButton } from '../../atoms/IconTextButton';

export interface TokenDisplayProps {
  balance: number;
  token: string;
  onExplainClick?: () => void;
  style?: CSSProperties;
}

export const TokenDisplay: FC<TokenDisplayProps> = ({ balance, token, onExplainClick, style }) => {
  return (
    <Paper
      elevation={5}
      style={{
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Xrp />
        <div style={{ marginLeft: '10px' }}>
          <Typography>{token}</Typography>
          <Typography variant="body2" style={{ color: SECONDARY_GRAY }}>
            {formatToken(balance, token)}
          </Typography>
        </div>
      </div>
      {onExplainClick ? (
        <IconTextButton onClick={onExplainClick}>
          <InfoOutlinedIcon style={{ color: SECONDARY_GRAY }} fontSize="small" />
          <Typography variant="body2" style={{ color: SECONDARY_GRAY, marginLeft: '3px' }}>
            Explain
          </Typography>
        </IconTextButton>
      ) : null}
    </Paper>
  );
};

import { CSSProperties, FC, useMemo } from 'react';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconButton, Paper, Typography } from '@mui/material';

import { SECONDARY_GRAY } from '../../../constants';
import { truncateAddress } from '../../../utils';
import { WalletIcon } from '../../atoms';

export interface WalletProps {
  publicAddress: string;
  name: string;
  style?: CSSProperties;
}

export const Wallet: FC<WalletProps> = ({ publicAddress, name, style }) => {
  const truncatedAddress = useMemo(() => truncateAddress(publicAddress), [publicAddress]);

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
        <WalletIcon publicAddress={publicAddress} />
        <div style={{ marginLeft: '10px' }}>
          <Typography>{name}</Typography>
          <Typography variant="body2" style={{ color: SECONDARY_GRAY }}>
            {truncatedAddress}
          </Typography>
        </div>
      </div>
      <IconButton aria-label="More">
        <MoreHorizIcon />
      </IconButton>
    </Paper>
  );
};

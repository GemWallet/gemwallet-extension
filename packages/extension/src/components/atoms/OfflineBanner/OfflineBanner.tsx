import { FC } from 'react';

import { WifiOff as WifiOffIcon } from '@mui/icons-material';
import { Button, Paper, Typography } from '@mui/material';

export interface OfflineBannerProps {
  reconnectToNetwork: () => void;
}

export const OfflineBanner: FC<OfflineBannerProps> = ({ reconnectToNetwork }) => {
  return (
    <Paper elevation={24}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
        <WifiOffIcon />
        <Typography variant="body2" style={{ marginRight: '8px', marginLeft: '8px' }}>
          Connection failed. Please try again or switch network
        </Typography>
        <Button variant="outlined" size="small" onClick={reconnectToNetwork}>
          Retry
        </Button>
      </div>
    </Paper>
  );
};

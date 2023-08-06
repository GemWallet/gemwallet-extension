import { FC, useCallback, useState } from 'react';

import { WifiOff as WifiOffIcon } from '@mui/icons-material';
import { Button, Paper, Typography } from '@mui/material';

import './style.css';

export interface OfflineBannerProps {
  reconnectToNetwork: () => void;
}

export const OfflineBanner: FC<OfflineBannerProps> = ({ reconnectToNetwork }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  const handleRetryClick = useCallback(() => {
    setIsAnimating(true);
    reconnectToNetwork();
  }, [reconnectToNetwork]);

  const onAnimationEnd = useCallback(() => {
    setIsAnimating(false);
  }, []);

  return (
    <Paper elevation={24} style={{ position: 'fixed', top: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
        <WifiOffIcon />
        <Typography
          variant="body2"
          className={isAnimating ? 'horizontal-shaking-animation' : undefined}
          onAnimationEnd={onAnimationEnd}
          style={{ marginRight: '8px', marginLeft: '16px' }}
        >
          Connection failed. Please try again or switch network
        </Typography>
        <Button variant="outlined" size="small" onClick={handleRetryClick}>
          Retry
        </Button>
      </div>
    </Paper>
  );
};

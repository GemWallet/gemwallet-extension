import { FC, useState, useEffect } from 'react';

import { Button } from '@mui/material';
import * as Sentry from '@sentry/react';

export const XPUNKS_1: FC = () => {
  const [isFeatureFlagEnabled, setIsFeatureFlagEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('featureFlags.json')
      .then((response) => response.json())
      .then((data) => {
        setIsFeatureFlagEnabled(data.FF_COLLAB_XPUNKS_1 === 1);
      })
      .catch((error) => {
        Sentry.captureException(error);
      });
  }, []);

  if (isFeatureFlagEnabled !== true) {
    return null;
  }

  const handleClick = () => {
    window.open('https://xpunks.club');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button
        size="small"
        onClick={handleClick}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <img
          alt="XPUNKS"
          height={40}
          src={'./collabs/XPUNKS/XPUNKS-Logo-Full-White.png'}
          style={{ marginBottom: '7px' }}
        />
      </Button>
    </div>
  );
};

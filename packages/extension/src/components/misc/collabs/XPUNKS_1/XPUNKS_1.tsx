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

  const blinking = `
    .blink {
      animation: blink ease 30s infinite;
      -webkit-animation: blink ease 30s infinite;
      -moz-animation: blink ease 30s infinite;
      -o-animation: blink ease 30s infinite;
      -ms-animation: blink ease 30s infinite;
    }
    
    @keyframes blink {
      0%, 2% { opacity: 0; }
      5%, 95% { opacity: 1; }
      98%, 100% { opacity: 0; }
    }
    
    @-moz-keyframes blink {
      0%, 2% { opacity: 0; }
      5%, 95% { opacity: 1; }
      98%, 100% { opacity: 0; }
    }
    
    @-webkit-keyframes blink {
      0%, 2% { opacity: 0; }
      5%, 95% { opacity: 1; }
      98%, 100% { opacity: 0; }
    }
    
    @-o-keyframes blink {
      0%, 2% { opacity: 0; }
      5%, 95% { opacity: 1; }
      98%, 100% { opacity: 0; }
    }
    
    @-ms-keyframes blink {
      0%, 2% { opacity: 0; }
      5%, 95% { opacity: 1; }
      98%, 100% { opacity: 0; }
    }
  `;

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
        <style>{blinking}</style>
        <img
          alt="XPUNKS"
          height={40}
          src={'./collabs/XPUNKS/XPUNKS-Logo-Full-White.png'}
          style={{ marginBottom: '7px' }}
          className={'blink'}
        />
      </Button>
    </div>
  );
};

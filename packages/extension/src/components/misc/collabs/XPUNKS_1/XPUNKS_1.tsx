import { FC } from 'react';

import { Button } from '@mui/material';

export const XPUNKS_1: FC = () => {
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
        <img alt="XPUNKS" height={30} src={'./collabs/XPUNKS/XPUNKS.gif'} />
        <img
          alt="XPUNKS"
          width={40}
          src={'./collabs/XPUNKS/logo.png'}
          style={{ marginBottom: '8px' }}
        />
      </Button>
    </div>
  );
};

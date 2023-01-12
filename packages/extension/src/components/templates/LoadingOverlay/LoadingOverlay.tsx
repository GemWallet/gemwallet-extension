import { FC } from 'react';

import { CircularProgress } from '@mui/material';

export const LoadingOverlay: FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 2,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      data-testid="loading"
    >
      <CircularProgress />
    </div>
  );
};

import { FC } from 'react';

import { CircularProgress, Container } from '@mui/material';

export const PageWithSpinner: FC = () => {
  return (
    <Container
      data-testid="page-with-spinner"
      component="main"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        overflowY: 'auto'
      }}
    >
      <CircularProgress />
    </Container>
  );
};

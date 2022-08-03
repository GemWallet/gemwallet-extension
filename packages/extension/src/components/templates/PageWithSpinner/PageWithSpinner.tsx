import { CircularProgress, Container } from '@mui/material';
import { FC } from 'react';

export const PageWithSpinner: FC = () => {
  return (
    <Container
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

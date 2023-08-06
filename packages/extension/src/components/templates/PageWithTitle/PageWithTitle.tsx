import { FC } from 'react';

import { Container, Typography } from '@mui/material';

import { useNetwork } from '../../../contexts';

export interface PageWithTitleProps {
  title: string;
  styles?: {
    container?: React.CSSProperties;
  };
}

export const PageWithTitle: FC<PageWithTitleProps> = ({ title, children, styles }) => {
  const { isConnectionFailed } = useNetwork();

  return (
    <Container
      component="main"
      style={{
        ...(isConnectionFailed ? { position: 'fixed', top: 56 } : {}),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: isConnectionFailed ? 'calc(100vh - 56px)' : '100vh',
        padding: '20px 16px',
        overflowY: 'auto',
        ...styles?.container
      }}
    >
      <Typography
        variant="h6"
        component="h1"
        style={{ fontSize: '1.75rem' }}
        gutterBottom
        data-testid="page-title"
      >
        {title}
      </Typography>
      {children}
    </Container>
  );
};

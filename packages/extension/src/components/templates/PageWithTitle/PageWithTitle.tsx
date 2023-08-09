import { FC } from 'react';

import { Container, Typography } from '@mui/material';

import { NETWORK_BANNER_HEIGHT } from '../../../constants';
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
        ...(isConnectionFailed ? { position: 'fixed', top: NETWORK_BANNER_HEIGHT } : {}),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: isConnectionFailed ? `calc(100vh - ${NETWORK_BANNER_HEIGHT}px)` : '100vh',
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

import { FC } from 'react';

import { Container, Typography } from '@mui/material';

export interface PageWithTitleProps {
  title: string;
  styles?: {
    container?: React.CSSProperties;
  };
}

export const PageWithTitle: FC<PageWithTitleProps> = ({ title, children, styles }) => {
  return (
    <Container
      component="main"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
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

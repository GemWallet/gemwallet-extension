import { Container, Typography } from '@mui/material';
import { FC } from 'react';

export interface PageWithTitleProps {
  title: string;
}

export const PageWithTitle: FC<PageWithTitleProps> = ({ title, children }) => {
  return (
    <Container
      component="main"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        padding: '20px 16px',
        overflowY: 'auto'
      }}
    >
      <Typography variant="h6" component="h1" style={{ fontSize: '1.75rem' }} gutterBottom>
        {title}
      </Typography>
      {children}
    </Container>
  );
};

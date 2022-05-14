import { FC } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Navbar, Drawer } from '../../organisms';
import { DrawerProvider } from '../../../contexts/DrawerContext';

export interface PageWithNavbarProps {
  title?: string;
}

export const PageWithNavbar: FC<PageWithNavbarProps> = ({ children, title }) => {
  return (
    <>
      <DrawerProvider>
        <Navbar />
        <Drawer />
      </DrawerProvider>
      <Container
        component="main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 'calc(100vh - 94px - 40px)',
          margin: '20px auto'
        }}
      >
        {title && (
          <Typography variant="h4" component="h1" style={{ fontSize: '1.75rem' }} gutterBottom>
            {title}
          </Typography>
        )}
        {children}
      </Container>
    </>
  );
};

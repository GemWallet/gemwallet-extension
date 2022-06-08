import { FC } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Navbar, NavMenu } from '../../organisms';
import { HEADER_HEIGHT, NAV_MENU_HEIGHT } from '../../../constants/size';

const MARGIN_TOP_CONTAINER = 20;
const CONTAINER_HEIGHT_TAKEN = HEADER_HEIGHT + NAV_MENU_HEIGHT + MARGIN_TOP_CONTAINER;

export interface PageWithNavbarProps {
  title?: string;
}

export const PageWithNavbar: FC<PageWithNavbarProps> = ({ children, title }) => {
  return (
    <>
      <Navbar />
      <Container
        component="main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: `calc(100vh - ${CONTAINER_HEIGHT_TAKEN}px)`,
          margin: `${MARGIN_TOP_CONTAINER}px auto 0 auto`,
          overflowY: 'auto'
        }}
      >
        {title && (
          <Typography variant="h4" component="h1" style={{ fontSize: '1.75rem' }} gutterBottom>
            {title}
          </Typography>
        )}
        {children}
      </Container>
      <NavMenu />
    </>
  );
};

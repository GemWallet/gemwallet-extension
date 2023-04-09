import { FC } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { HEADER_HEIGHT, NAV_MENU_HEIGHT } from '../../../constants';
import { useWallet } from '../../../contexts';
import { Header, NavMenu } from '../../organisms';

const MARGIN_TOP_CONTAINER = 20;
const CONTAINER_HEIGHT_TAKEN = HEADER_HEIGHT + NAV_MENU_HEIGHT + MARGIN_TOP_CONTAINER;

export interface PageWithHeaderProps {
  title?: string;
}

export const PageWithHeader: FC<PageWithHeaderProps> = ({ children, title }) => {
  const { wallets, selectedWallet } = useWallet();

  if (!wallets?.[selectedWallet]) {
    return null;
  }
  return (
    <>
      <Header wallet={wallets[selectedWallet]} />
      <Container
        component="main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: `calc(100vh - ${CONTAINER_HEIGHT_TAKEN}px)`,
          margin: `${MARGIN_TOP_CONTAINER}px auto 0 auto`,
          overflowY: 'auto'
        }}
      >
        {title && (
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            {title}
          </Typography>
        )}
        {children}
      </Container>
      <NavMenu />
    </>
  );
};

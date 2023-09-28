import { CSSProperties, FC, useMemo } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';

import {
  HEADER_HEIGHT,
  NAV_MENU_HEIGHT,
  NETWORK_BANNER_HEIGHT,
  navigation
} from '../../../constants';
import { useNetwork, useWallet } from '../../../contexts';
import { Header, NavMenu } from '../../organisms';

const MARGIN_TOP_CONTAINER = 20;
const CONTAINER_HEIGHT_TAKEN = HEADER_HEIGHT + NAV_MENU_HEIGHT + MARGIN_TOP_CONTAINER;

export interface PageWithHeaderProps {
  title?: string;
  styles?: {
    root?: CSSProperties;
    container?: CSSProperties;
  };
}

export const PageWithHeader: FC<PageWithHeaderProps> = ({ children, styles, title }) => {
  const { wallets, selectedWallet } = useWallet();
  const { hasOfflineBanner } = useNetwork();
  const location = useLocation();
  const indexDefaultNav = useMemo(
    () => navigation.findIndex((item) => item.pathname === location.pathname),
    [location.pathname]
  );

  if (!wallets?.[selectedWallet]) {
    return null;
  }
  return (
    <div
      style={{
        ...(hasOfflineBanner
          ? {
              width: '100%',
              position: 'fixed',
              top: NETWORK_BANNER_HEIGHT
            }
          : {}),
        ...styles?.root
      }}
    >
      <Header wallet={wallets[selectedWallet]} />
      <Container
        component="main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: `calc(100vh - ${CONTAINER_HEIGHT_TAKEN}px${
            hasOfflineBanner ? ` - ${NETWORK_BANNER_HEIGHT}px` : ''
          })`,
          margin: `${MARGIN_TOP_CONTAINER}px auto 0 auto`,
          overflowY: 'auto',
          ...styles?.container
        }}
      >
        {title && (
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            {title}
          </Typography>
        )}
        {children}
      </Container>
      <NavMenu indexDefaultNav={indexDefaultNav} />
    </div>
  );
};

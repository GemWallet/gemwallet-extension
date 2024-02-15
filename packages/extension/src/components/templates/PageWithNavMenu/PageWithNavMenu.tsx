import { FC } from 'react';

import { NAV_MENU_HEIGHT, NETWORK_BANNER_HEIGHT } from '../../../constants';
import { useNetwork } from '../../../contexts';
import { NavMenu } from '../../organisms';

export interface PageWithNavMenuProps {
  indexDefaultNav: number;
  children: React.ReactNode;
}

export const PageWithNavMenu: FC<PageWithNavMenuProps> = ({ children, indexDefaultNav }) => {
  const { hasOfflineBanner } = useNetwork();

  return (
    <>
      <div
        style={{
          height: `calc(100% - ${NAV_MENU_HEIGHT}px${
            hasOfflineBanner ? ` - ${NETWORK_BANNER_HEIGHT}px` : ''
          })`,
          position: 'fixed',
          top: hasOfflineBanner ? NETWORK_BANNER_HEIGHT : undefined,
          width: '100%'
        }}
      >
        {children}
      </div>
      <NavMenu indexDefaultNav={indexDefaultNav} />
    </>
  );
};

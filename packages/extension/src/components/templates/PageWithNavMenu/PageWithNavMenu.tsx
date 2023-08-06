import { FC } from 'react';

import { NAV_MENU_HEIGHT } from '../../../constants';
import { useNetwork } from '../../../contexts';
import { NavMenu } from '../../organisms';

export interface PageWithNavMenuProps {
  indexDefaultNav?: number;
}

export const PageWithNavMenu: FC<PageWithNavMenuProps> = ({ children, indexDefaultNav }) => {
  const { isConnectionFailed } = useNetwork();

  return (
    <>
      <div
        style={{
          height: `calc(100% - ${NAV_MENU_HEIGHT}px${isConnectionFailed ? ' - 56px' : ''})`,
          position: 'fixed',
          top: isConnectionFailed ? 56 : undefined,
          width: '100%'
        }}
      >
        {children}
      </div>
      <NavMenu indexDefaultNav={indexDefaultNav} />
    </>
  );
};

import { FC } from 'react';

import { NAV_MENU_HEIGHT } from '../../../constants';
import { NavMenu } from '../../organisms';

export interface PageWithNavMenuProps {
  indexDefaultNav?: number;
}

export const PageWithNavMenu: FC<PageWithNavMenuProps> = ({ children, indexDefaultNav }) => {
  return (
    <>
      <div
        style={{
          height: `calc(100% - ${NAV_MENU_HEIGHT}px)`,
          position: 'fixed',
          width: '100%'
        }}
      >
        {children}
      </div>
      <NavMenu indexDefaultNav={indexDefaultNav} />
    </>
  );
};

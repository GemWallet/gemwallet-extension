import { FC } from 'react';
import { NavMenu } from '../../organisms';
import { NAV_MENU_HEIGHT } from '../../../constants/size';

export const PageWithNavMenu: FC = ({ children }) => {
  return (
    <>
      <div
        style={{
          height: `calc(100vh - ${NAV_MENU_HEIGHT}px)`,
          overflowY: 'auto'
        }}
      >
        {children}
      </div>
      <NavMenu />
    </>
  );
};

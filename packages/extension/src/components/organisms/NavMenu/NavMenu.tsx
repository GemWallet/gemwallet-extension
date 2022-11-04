import { FC, useMemo } from 'react';

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import { navigation } from '../../../constants';

export interface NavMenuProps {
  indexDefaultNav?: number;
}

export const NavMenu: FC<NavMenuProps> = ({ indexDefaultNav }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const value = useMemo(
    () => indexDefaultNav || navigation.findIndex((link) => link.pathname === pathname),
    [indexDefaultNav, pathname]
  );

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        const { pathname } = navigation[newValue];
        navigate(pathname);
      }}
    >
      {navigation.map(({ label, icon }) => {
        return <BottomNavigationAction key={label} label={label} icon={icon} />;
      })}
    </BottomNavigation>
  );
};

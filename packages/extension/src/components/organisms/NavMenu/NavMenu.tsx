import { FC, useMemo } from 'react';

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { styled } from '@mui/system';
import { useLocation, useNavigate } from 'react-router-dom';

import { navigation } from '../../../constants';

const StyledBottomNavigationAction = styled(BottomNavigationAction)`
  &.Mui-selected {
    border-top: 4px solid #3dd4f5;
  }
  border-top: 4px solid transparent;
`;

export interface NavMenuProps {
  indexDefaultNav?: number;
}

export const NavMenu: FC<NavMenuProps> = ({ indexDefaultNav }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const value = useMemo(
    () => indexDefaultNav ?? navigation.findIndex((link) => link.pathname === pathname),
    [indexDefaultNav, pathname]
  );

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        const { pathname } = navigation[newValue];
        navigate(pathname);
      }}
      style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: '#1e1e1e'
      }}
    >
      {navigation.map(({ label, icon }, index) => (
        <StyledBottomNavigationAction key={label} label={label} icon={icon} value={index} />
      ))}
    </BottomNavigation>
  );
};

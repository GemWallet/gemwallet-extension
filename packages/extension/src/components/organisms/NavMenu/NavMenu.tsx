import { FC, MouseEvent, useState, useEffect, useMemo } from 'react';

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { styled } from '@mui/system';
import { useLocation, useNavigate } from 'react-router-dom';

import { navigation } from '../../../constants';

const StyledBottomNavigation = styled(BottomNavigation)`
  --decoration-left: 50%;
  --decoration-width: 0;
  position: relative;
  border-top: none !important;
  box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.25);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: var(--decoration-left);
    width: var(--decoration-width);
    height: 2px;
    background: skyblue;
    transition: 300ms;
    border-radius: 2px;
  }
`;

const StyledBottomNavigationAction = styled(BottomNavigationAction)`
  border-top: none !important;
  box-shadow: none !important;
`;

export interface NavMenuProps {
  indexDefaultNav?: number;
}

export const NavMenu: FC<NavMenuProps> = ({ indexDefaultNav }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [styleValues, setStyleValues] = useState({});
  const value = useMemo(
    () => indexDefaultNav ?? navigation.findIndex((link) => link.pathname === pathname),
    [indexDefaultNav, pathname]
  );

  useEffect(() => {
    if (value !== -1) {
      const element = document.querySelectorAll('.MuiBottomNavigationAction-root')[
        value
      ] as HTMLElement;
      if (element) {
        const reducedWidth = element.offsetWidth * 0.75;
        const adjustedLeft = element.offsetLeft + (element.offsetWidth - reducedWidth) / 2;
        setStyleValues({
          '--decoration-left': `${adjustedLeft}px`,
          '--decoration-width': `${reducedWidth}px`
        });
      }
    }
  }, [value]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>, newValue: number) => {
    const { pathname } = navigation[newValue];
    navigate(pathname);
  };

  return (
    <StyledBottomNavigation
      value={value}
      style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: '#272727',
        ...styleValues
      }}
    >
      {navigation.map(({ label, icon }, index) => (
        <StyledBottomNavigationAction
          key={label}
          label={label}
          icon={icon}
          value={index}
          showLabel
          onClick={(e) => handleClick(e, index)}
        />
      ))}
    </StyledBottomNavigation>
  );
};

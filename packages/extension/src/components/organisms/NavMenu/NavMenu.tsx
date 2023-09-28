import { CSSProperties, FC, MouseEvent, useEffect } from 'react';

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

import { GEMWALLET_BLUE, navigation } from '../../../constants';
import { useNavBarPosition } from '../../../contexts';

const defaultDecoration = {
  '--decoration-left': '50%',
  '--decoration-width': '0'
};

const StyledBottomNavigation = styled(BottomNavigation)`
  ${defaultDecoration}
  position: relative;
  border-top: none !important;
  box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.35);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: var(--decoration-left);
    width: var(--decoration-width);
    height: 2px;
    background: ${GEMWALLET_BLUE};
    transition: 300ms;
    border-radius: 2px;
  }
`;

const StyledBottomNavigationAction = styled(BottomNavigationAction)`
  border-top: none !important;
  box-shadow: none !important;
`;

export interface NavMenuProps {
  indexDefaultNav: number;
}

export const NavMenu: FC<NavMenuProps> = ({ indexDefaultNav }) => {
  const navigate = useNavigate();
  const { navBarPosition, setNavBarPosition } = useNavBarPosition();

  useEffect(() => {
    if (indexDefaultNav !== -1) {
      const element = document.querySelectorAll('.MuiBottomNavigationAction-root')[
        indexDefaultNav
      ] as HTMLElement;
      if (element) {
        const reducedWidth = element.offsetWidth * 0.75;
        const adjustedLeft = element.offsetLeft + (element.offsetWidth - reducedWidth) / 2;
        setNavBarPosition({
          left: `${adjustedLeft}px`,
          width: `${reducedWidth}px`
        });
      }
    }
  }, [setNavBarPosition, indexDefaultNav]);

  const handleClick = (_: MouseEvent<HTMLButtonElement>, newValue: number) => {
    const { pathname } = navigation[newValue];
    navigate(pathname);
  };

  const style: CSSProperties & { [key: string]: string | number } = {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#272727',
    '--decoration-left': navBarPosition.left,
    '--decoration-width': navBarPosition.width
  };

  return (
    <StyledBottomNavigation value={indexDefaultNav} style={style}>
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

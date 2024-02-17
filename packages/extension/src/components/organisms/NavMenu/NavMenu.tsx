import { CSSProperties, FC, MouseEvent, useEffect, useMemo } from 'react';

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { styled } from '@mui/system';
import { FaGhost, FaHatWizard, FaSpider } from 'react-icons/fa';
import { GiPumpkinLantern } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

import {
  GEMWALLET_BLUE,
  GEMWALLET_HALLOWEEN_ORANGE,
  navigation as navigationConstant
} from '../../../constants';
import { useNavBarPosition } from '../../../contexts';

const defaultDecoration = {
  '--decoration-left': '50%',
  '--decoration-width': '0'
};

const StyledBottomNavigationAction = styled(BottomNavigationAction)`
  border-top: none !important;
  box-shadow: none !important;
`;

export interface NavMenuProps {
  indexDefaultNav: number;
}

export const NavMenu: FC<NavMenuProps> = ({ indexDefaultNav }) => {
  const navigate = useNavigate();
  const { navBarPosition, setNavBarPosition, isHalloween } = useNavBarPosition();

  const StyledBottomNavigation = useMemo(() => {
    const backgroundColor = isHalloween ? GEMWALLET_HALLOWEEN_ORANGE : GEMWALLET_BLUE;

    return styled(BottomNavigation)`
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
        background: ${backgroundColor};
        transition: 300ms;
        border-radius: 2px;
      }
    `;
  }, [isHalloween]);

  const navigation = useMemo(() => {
    if (!isHalloween) {
      return navigationConstant;
    }
    const navigationHalloween = [
      <GiPumpkinLantern size={25} />,
      <FaGhost size={25} />,
      <FaHatWizard size={25} />,
      <FaSpider size={25} />
    ];

    if (navigationConstant.length !== navigationHalloween.length) {
      throw new Error('navigation constant and navigation Halloween must have the same length');
    }

    return navigationConstant.map((navItem, index) => ({
      ...navItem,
      icon: navigationHalloween[index]
    }));
  }, [isHalloween]);

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
          onClick={(e: MouseEvent<HTMLButtonElement>) => handleClick(e, index)}
        />
      ))}
    </StyledBottomNavigation>
  );
};

import { createContext, FC, useContext, useMemo, useState } from 'react';

import * as Sentry from '@sentry/react';

import { useFeatureFlags } from '../../hooks';

interface NavBarPosition {
  left: string;
  width: string;
}

interface NavBarPositionContextType {
  setNavBarPosition: (position: NavBarPosition) => void;
  navBarPosition: NavBarPosition;
  isHalloween: boolean;
}

const defaultPosition = {
  left: '0%',
  width: '0'
};

const NavBarPositionContext = createContext<NavBarPositionContextType>({
  setNavBarPosition: () => {},
  navBarPosition: defaultPosition,
  isHalloween: false
});

const NavBarPositionProvider: FC = ({ children }) => {
  const [navBarPosition, setNavBarPosition] = useState<NavBarPosition>(defaultPosition);
  const { featureFlags } = useFeatureFlags();

  const isHalloween = useMemo<boolean>(() => {
    return (featureFlags as any)['CITROUILLE_2K23'];
  }, [featureFlags]);

  const contextValue: NavBarPositionContextType = {
    navBarPosition,
    setNavBarPosition,
    isHalloween
  };

  return (
    <NavBarPositionContext.Provider value={contextValue}>{children}</NavBarPositionContext.Provider>
  );
};

const useNavBarPosition = (): NavBarPositionContextType => {
  const context = useContext(NavBarPositionContext);

  if (context === undefined) {
    const error = new Error('useNavBarPosition must be used within a NavBarPositionProvider');
    Sentry.captureException(error);
    throw error;
  }

  return context;
};

export { NavBarPositionProvider, NavBarPositionContext, useNavBarPosition };

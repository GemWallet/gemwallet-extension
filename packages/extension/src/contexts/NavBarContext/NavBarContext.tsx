import { createContext, FC, useContext, useState } from 'react';

import * as Sentry from '@sentry/react';

interface NavBarPosition {
  left: string;
  width: string;
}

interface NavBarPositionContextType {
  setNavBarPosition: (position: NavBarPosition) => void;
  navBarPosition: NavBarPosition;
}

interface Props {
  children: React.ReactElement;
}

const defaultPosition = {
  left: '0%',
  width: '0'
};

const NavBarPositionContext = createContext<NavBarPositionContextType>({
  setNavBarPosition: () => {},
  navBarPosition: defaultPosition
});

const NavBarPositionProvider: FC<Props> = ({ children }) => {
  const [navBarPosition, setNavBarPosition] = useState<NavBarPosition>(defaultPosition);

  const contextValue: NavBarPositionContextType = {
    navBarPosition,
    setNavBarPosition
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

import { createContext, FC, useState } from 'react';

interface NavBarPosition {
  left: string;
  width: string;
}

export interface NavBarPositionContextType {
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

export const NavBarPositionContext = createContext<NavBarPositionContextType>({
  setNavBarPosition: () => {},
  navBarPosition: defaultPosition
});

export const NavBarPositionProvider: FC<Props> = ({ children }) => {
  const [navBarPosition, setNavBarPosition] = useState<NavBarPosition>(defaultPosition);

  const contextValue: NavBarPositionContextType = {
    navBarPosition,
    setNavBarPosition
  };

  return (
    <NavBarPositionContext.Provider value={contextValue}>{children}</NavBarPositionContext.Provider>
  );
};

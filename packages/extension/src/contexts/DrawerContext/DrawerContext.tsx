import { ReactNode, useContext, useState, createContext } from 'react';

type contextType = {
  isOpen: boolean;
  openDrawer: (open: boolean) => void;
};

const DrawerContext = createContext<contextType>({
  isOpen: false,
  openDrawer: () => {}
});

function DrawerProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openDrawer = (open: boolean) => {
    setIsOpen(open);
  };

  const value: contextType = {
    isOpen,
    openDrawer
  };

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

function useDrawer(): contextType {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
}

export { DrawerProvider, DrawerContext, useDrawer };

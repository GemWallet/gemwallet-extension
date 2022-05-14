import { useContext, useState, createContext, FC } from 'react';

interface ContextType {
  isOpen: boolean;
  openDrawer: (open: boolean) => void;
}

const DrawerContext = createContext<ContextType>({
  isOpen: false,
  openDrawer: () => {}
});

const DrawerProvider: FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openDrawer = (open: boolean) => {
    setIsOpen(open);
  };

  const value: ContextType = {
    isOpen,
    openDrawer
  };

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
};

const useDrawer = (): ContextType => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};

export { DrawerProvider, DrawerContext, useDrawer };

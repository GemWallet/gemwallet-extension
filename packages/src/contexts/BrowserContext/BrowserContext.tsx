import { ReactNode, useContext, useState, useEffect, createContext } from 'react';

export type CloseProps = {
  windowId: number;
  callback?: Function;
};

type contextType = {
  window?: chrome.windows.Window;
  closeExtension: ({ windowId, callback }: CloseProps) => void;
};

const BrowserContext = createContext<contextType>({
  window: undefined,
  closeExtension: () => {}
});

function BrowserProvider({ children }: { children: ReactNode }): JSX.Element {
  const [window, setWindow] = useState<any>();

  const getCurrentWindow = async () => {
    if (chrome?.windows) {
      await chrome.windows.getCurrent((_window) => setWindow(_window));
    }
  };

  useEffect(() => {
    getCurrentWindow();
  }, []);

  const closeExtension = ({ windowId, callback }: CloseProps) => {
    if (chrome?.windows) {
      chrome.windows.remove(windowId, callback);
    }
  };

  const value: contextType = {
    window,
    closeExtension
  };

  return <BrowserContext.Provider value={value}>{children}</BrowserContext.Provider>;
}

function useBrowser(): contextType {
  const context = useContext(BrowserContext);
  if (context === undefined) {
    throw new Error('useBrowser must be used within a BrowserProvider');
  }
  return context;
}

export { BrowserProvider, BrowserContext, useBrowser };

import { useContext, useState, useEffect, createContext, FC, useCallback } from 'react';
import * as Sentry from '@sentry/react';

export interface CloseProps {
  windowId: number;
  callback?: Function;
}

interface ContextType {
  window?: chrome.windows.Window;
  closeExtension: ({ windowId, callback }: CloseProps) => void;
}

const BrowserContext = createContext<ContextType>({
  window: undefined,
  closeExtension: () => {}
});

const BrowserProvider: FC = ({ children }) => {
  const [window, setWindow] = useState<chrome.windows.Window | undefined>();

  const getCurrentWindow = useCallback(async () => {
    if (chrome?.windows) {
      await chrome.windows.getCurrent((_window) => setWindow(_window));
    }
  }, []);

  useEffect(() => {
    getCurrentWindow();
  }, [getCurrentWindow]);

  const closeExtension = useCallback(({ windowId, callback }: CloseProps) => {
    if (chrome?.windows) {
      chrome.windows.remove(windowId, callback);
    }
  }, []);

  const value: ContextType = {
    window,
    closeExtension
  };

  return <BrowserContext.Provider value={value}>{children}</BrowserContext.Provider>;
};

const useBrowser = (): ContextType => {
  const context = useContext(BrowserContext);
  if (context === undefined) {
    const error = new Error('useBrowser must be used within a BrowserProvider');
    Sentry.captureException(error);
    throw error;
  }
  return context;
};

export { BrowserProvider, BrowserContext, useBrowser };

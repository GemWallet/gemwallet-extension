import { useContext, useState, useEffect, createContext, FC, useCallback } from 'react';

import * as Sentry from '@sentry/react';

export interface CloseProps {
  windowId: number;
}

interface ContextType {
  window?: chrome.windows.Window;
  closeExtension: ({ windowId }: CloseProps) => void;
}

const BrowserContext = createContext<ContextType>({
  window: undefined,
  closeExtension: () => {}
});

interface Props {
  children: React.ReactElement;
}

const BrowserProvider: FC<Props> = ({ children }) => {
  const [window, setWindow] = useState<chrome.windows.Window | undefined>();

  const getCurrentWindow = useCallback(() => {
    if (chrome?.windows) {
      chrome.windows.getCurrent((_window) => setWindow(_window));
    }
  }, []);

  useEffect(() => {
    getCurrentWindow();
  }, [getCurrentWindow]);

  const closeExtension = useCallback(({ windowId }: CloseProps) => {
    if (chrome?.windows) {
      chrome.storage.local.remove('currentWindowId');
      chrome.windows.remove(windowId);
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

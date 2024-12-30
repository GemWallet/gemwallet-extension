import { useState, useEffect, createContext, FC, useCallback } from 'react';

interface CloseProps {
  windowId: number;
}

export interface ContextType {
  window?: chrome.windows.Window;
  closeExtension: ({ windowId }: CloseProps) => void;
}

export const BrowserContext = createContext<ContextType>({
  window: undefined,
  closeExtension: () => {}
});

interface Props {
  children: React.ReactElement;
}

export const BrowserProvider: FC<Props> = ({ children }) => {
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

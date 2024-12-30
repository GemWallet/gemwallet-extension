import * as Sentry from '@sentry/react';
import { useContext } from 'react';
import { BrowserContext, ContextType } from './BrowserContext';

export const useBrowser = (): ContextType => {
  const context = useContext(BrowserContext);
  if (context === undefined) {
    const error = new Error('useBrowser must be used within a BrowserProvider');
    Sentry.captureException(error);
    throw error;
  }
  return context;
};

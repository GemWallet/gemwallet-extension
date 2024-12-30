import * as Sentry from '@sentry/react';
import { NetworkContext, NetworkContextType } from './NetworkContext';
import { useContext } from 'react';

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    const error = new Error('useNetwork must be used within a NetworkProvider');
    Sentry.captureException(error);
    throw error;
  }
  return context;
};

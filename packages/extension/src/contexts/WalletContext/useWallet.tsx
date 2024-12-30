import * as Sentry from '@sentry/react';
import { useContext } from 'react';
import { WalletContext, WalletContextType } from './WalletContext';

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    const error = new Error('useWallet must be used within a WalletProvider');
    Sentry.captureException(error);
    throw error;
  }
  return context;
};

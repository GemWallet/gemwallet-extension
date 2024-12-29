import { useContext } from 'react';
import { LedgerContext, LedgerContextType } from './LedgerContext';
import * as Sentry from '@sentry/react';

export const useLedger = (): LedgerContextType => {
  const context = useContext(LedgerContext);
  if (context === undefined) {
    const error = new Error('useLedger must be used within a LedgerProvider');
    Sentry.captureException(error);
    throw error;
  }
  return context;
};

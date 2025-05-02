import * as Sentry from '@sentry/react';
import { useContext } from 'react';
import {
  TransactionProgressContext,
  TransactionProgressContextType
} from './TransactionProgressContext';

export const useTransactionProgress = (): TransactionProgressContextType => {
  const context = useContext(TransactionProgressContext);

  if (context === undefined) {
    const error = new Error(
      'useTransactionProgress must be used within a TransactionProgressProvider'
    );
    Sentry.captureException(error);
    throw error;
  }

  return context;
};

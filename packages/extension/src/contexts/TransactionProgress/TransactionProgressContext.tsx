import { useContext, createContext, FC, useState } from 'react';

import * as Sentry from '@sentry/react';

export enum TransactionProgressStatuses {
  IN_PROGRESS = 'IN_PROGRESS',
  IDLE = 'IDLE'
}

interface ContextType {
  setTransactionProgress: (status: string) => void;
  transactionProgress?: string;
}

const TransactionProgressContext = createContext<ContextType>({
  setTransactionProgress: () => {},
  transactionProgress: undefined
});

const TransactionProgressProvider: FC = ({ children }) => {
  const [transactionProgress, setTransactionProgress] = useState<string | undefined>(undefined);

  const value: ContextType = {
    transactionProgress,
    setTransactionProgress
  };

  return (
    <TransactionProgressContext.Provider value={value}>
      {children}
    </TransactionProgressContext.Provider>
  );
};

const useTransactionProgress = (): ContextType => {
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

export { TransactionProgressProvider, TransactionProgressContext, useTransactionProgress };

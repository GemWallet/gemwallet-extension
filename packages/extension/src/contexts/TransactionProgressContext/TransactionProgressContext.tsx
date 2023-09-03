import { createContext, FC, useContext, useState } from 'react';

import * as Sentry from '@sentry/react';

export enum TransactionProgressStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  IDLE = 'IDLE'
}

interface TransactionProgressContextType {
  setTransactionProgress: (status: TransactionProgressStatus) => void;
  transactionProgress?: TransactionProgressStatus;
}

const TransactionProgressContext = createContext<TransactionProgressContextType>({
  setTransactionProgress: () => {},
  transactionProgress: undefined
});

const TransactionProgressProvider: FC = ({ children }) => {
  const [transactionProgress, setTransactionProgress] = useState<
    TransactionProgressStatus | undefined
  >(undefined);

  const contextValue: TransactionProgressContextType = {
    transactionProgress,
    setTransactionProgress
  };

  return (
    <TransactionProgressContext.Provider value={contextValue}>
      {children}
    </TransactionProgressContext.Provider>
  );
};

const useTransactionProgress = (): TransactionProgressContextType => {
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

import { createContext, FC, useState } from 'react';

import { TransactionProgressStatus } from './TransactionProgressStatus.enum';

interface Props {
  children: React.ReactElement;
}

export interface TransactionProgressContextType {
  setTransactionProgress: (status: TransactionProgressStatus) => void;
  transactionProgress: TransactionProgressStatus;
}

export const TransactionProgressContext = createContext<TransactionProgressContextType>({
  setTransactionProgress: () => {},
  transactionProgress: TransactionProgressStatus.IN_PROGRESS
});

export const TransactionProgressProvider: FC<Props> = ({ children }) => {
  const [transactionProgress, setTransactionProgress] = useState<TransactionProgressStatus>(
    TransactionProgressStatus.IN_PROGRESS
  );

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

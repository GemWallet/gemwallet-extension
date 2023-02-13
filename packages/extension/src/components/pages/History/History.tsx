import { FC, useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';

import { useLedger } from '../../../contexts';
import { AccountTransaction } from '../../../types';
import { TransactionListing } from '../../organisms';
import { PageWithHeader } from '../../templates';

export const History: FC = () => {
  const { getTransactions } = useLedger();

  const [transactions, setTransactions] = useState<AccountTransaction[] | null>(null);

  useEffect(() => {
    const getTx = async () => {
      const tx = await getTransactions();
      setTransactions(tx);
    };
    getTx();
  }, [getTransactions]);

  return (
    <PageWithHeader>
      {transactions === null ? (
        <div
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <TransactionListing transactions={transactions} />
      )}
    </PageWithHeader>
  );
};

import { FC, useEffect, useMemo, useState } from 'react';

import { Button, CircularProgress, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';

import { HISTORY_PATH, navigation } from '../../../constants';
import { LEDGER_CONNECTION_ERROR, useLedger, useNetwork } from '../../../contexts';
import { AccountTransaction } from '../../../types';
import { InformationMessage } from '../../molecules';
import { TransactionListing } from '../../organisms';
import { PageWithHeader } from '../../templates';

export const History: FC = () => {
  const { getTransactions } = useLedger();
  const { reconnectToNetwork } = useNetwork();

  const [transactions, setTransactions] = useState<AccountTransaction[] | null>(null);
  const [isTxFailed, setIsTxFailed] = useState<boolean>(false);

  const indexDefaultNav = useMemo(
    () => navigation.findIndex((link) => link.pathname === HISTORY_PATH),
    []
  );

  useEffect(() => {
    const getTx = async () => {
      try {
        const tx = await getTransactions();
        setTransactions(tx);
      } catch (e) {
        if ((e as Error).message === LEDGER_CONNECTION_ERROR) {
          setIsTxFailed(true);
        } else {
          Sentry.captureException(e);
        }
      }
    };
    getTx();
  }, [getTransactions]);

  if (isTxFailed) {
    return (
      <PageWithHeader indexDefaultNav={indexDefaultNav}>
        <InformationMessage
          title="Failed to connect to the network"
          style={{
            padding: '15px'
          }}
        >
          <Typography style={{ marginBottom: '5px' }}>
            There was an error attempting to connect to the network. Please refresh the page and try
            again.
          </Typography>
          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <Button
              variant="contained"
              onClick={reconnectToNetwork}
              style={{ marginBottom: '10px' }}
            >
              Refresh
            </Button>
          </div>
        </InformationMessage>
      </PageWithHeader>
    );
  }

  return (
    <PageWithHeader indexDefaultNav={indexDefaultNav}>
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

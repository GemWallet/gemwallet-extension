import { FC, useCallback, useMemo, useState } from 'react';

import TransactionIcon from '@mui/icons-material/CompareArrows';
import { List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import { unix } from 'moment';

import { formatDate, formatTransaction } from './format.util';
import { TransactionDetails } from './TransactionDetails';
import { useWallet } from '../../../contexts';
import { AccountTransaction } from '../../../types';
import { InformationMessage } from '../../molecules';
import { DialogPage, PageWithSpinner } from '../../templates';

export interface TransactionListingProps {
  transactions: AccountTransaction[];
}

export const TransactionListing: FC<TransactionListingProps> = ({ transactions }) => {
  const [openedTx, setOpenedTx] = useState<AccountTransaction | null>(null);

  const { getCurrentWallet } = useWallet();
  const wallet = getCurrentWallet();

  const handleClick = useCallback((transaction: AccountTransaction) => {
    setOpenedTx(transaction);
  }, []);

  const handleClose = useCallback(() => {
    setOpenedTx(null);
  }, []);

  const transactionsByDate = useMemo(() => {
    const grouped = new Map<string, AccountTransaction[]>();
    transactions.forEach((transaction) => {
      const date = transaction.tx?.date
        ? unix(946684800 + transaction.tx.date).format('MMM DD, YYYY')
        : 'Unknown Date';
      const group = grouped.get(date) || [];
      group.push(transaction);
      grouped.set(date, group);
    });
    return grouped;
  }, [transactions]);

  if (!wallet) {
    return <PageWithSpinner />;
  }

  if (transactions.length === 0) {
    return (
      <InformationMessage title="No transactions to show">
        <div style={{ marginBottom: '5px' }}>
          There are no history of transactions with this wallet.
        </div>
      </InformationMessage>
    );
  }

  return (
    <>
      <List dense style={{ paddingTop: 0 }}>
        {Array.from(transactionsByDate).map(([date, transactionsForDate]) => (
          <div key={date}>
            <Typography
              style={{ marginTop: '0', marginBottom: '5px', fontSize: '14px', fontWeight: '400' }}
            >
              {date}
            </Typography>
            {transactionsForDate.map((transaction, index) => (
              <Paper
                key={transaction.tx?.hash ?? index}
                elevation={5}
                style={{
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  cursor: 'pointer'
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)'
                  }
                }}
                onClick={() => handleClick(transaction)}
              >
                <ListItem>
                  <ListItemIcon>
                    <TransactionIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={formatTransaction(transaction, wallet.publicAddress)}
                    secondary={transaction.tx?.date ? formatDate(transaction.tx?.date) : undefined}
                  />
                </ListItem>
              </Paper>
            ))}
          </div>
        ))}
      </List>
      <DialogPage
        title="Transaction Details"
        onClose={handleClose}
        open={openedTx !== null}
        data-testid="dialog"
      >
        <TransactionDetails transaction={openedTx} publicAddress={wallet.publicAddress} />
      </DialogPage>
    </>
  );
};

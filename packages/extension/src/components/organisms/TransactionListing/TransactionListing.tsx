import React, { FC, useCallback, useState } from 'react';

import TransactionIcon from '@mui/icons-material/CompareArrows';
import { List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import { unix } from 'moment';
import { DepositPreauth, Payment, SetRegularKey } from 'xrpl';

import { useWallet } from '../../../contexts';
import { AccountTransaction, TransactionTypes } from '../../../types';
import { formatAmount } from '../../../utils';
import { InformationMessage } from '../../molecules';
import { DialogPage, PageWithSpinner } from '../../templates';
import { TransactionDetails } from './TransactionDetails';
import { TransactionFilters } from './TransactionFilters';

export interface TransactionListingProps {
  transactions: AccountTransaction[];
}

type TransactionFormatter = (transaction: AccountTransaction, publicAddress: string) => string;

const transactionMappers: Record<TransactionTypes, TransactionFormatter> = {
  [TransactionTypes.Payment]: (transaction, publicAddress) => {
    const amount = formatAmount((transaction.tx as Payment).Amount);
    return (transaction.tx as Payment).Destination === publicAddress
      ? `Payment received - ${amount}`
      : `Payment sent - ${amount}`;
  },
  [TransactionTypes.TrustSet]: () => 'TrustLine transaction',
  [TransactionTypes.EscrowCreate]: () => 'Create escrow',
  [TransactionTypes.EscrowFinish]: () => 'Finish escrow',
  [TransactionTypes.EscrowCancel]: () => 'Cancel escrow',
  [TransactionTypes.AccountSet]: () => 'Edit account',
  [TransactionTypes.SignerListSet]: () => 'Set Signer List',
  [TransactionTypes.OfferCreate]: () => 'Create offer',
  [TransactionTypes.OfferCancel]: () => 'Cancel offer',
  [TransactionTypes.AccountDelete]: () => 'Delete Account',
  [TransactionTypes.SetRegularKey]: (transaction) => {
    if ((transaction.tx as SetRegularKey).RegularKey) {
      return 'Set Regular Key';
    }
    return 'Remove Regular Key';
  },
  [TransactionTypes.DepositPreauth]: (transaction) => {
    if ((transaction.tx as DepositPreauth).Authorize) {
      return 'Authorize Deposit';
    }
    return 'Unauthorize Deposit';
  },
  [TransactionTypes.CheckCreate]: () => 'Create check',
  [TransactionTypes.CheckCash]: () => 'Cash check',
  [TransactionTypes.CheckCancel]: () => 'Cancel check',
  [TransactionTypes.TicketCreate]: () => 'Create ticket',
  [TransactionTypes.PaymentChannelCreate]: () => 'Create payment channel',
  [TransactionTypes.PaymentChannelClaim]: () => 'Claim payment channel',
  [TransactionTypes.PaymentChannelFund]: () => 'Fund payment channel',
  [TransactionTypes.NFTokenMint]: () => 'Mint NFT',
  [TransactionTypes.NFTokenBurn]: () => 'Burn NFT',
  [TransactionTypes.NFTokenCreateOffer]: () => 'Create NFT offer',
  [TransactionTypes.NFTokenCancelOffer]: () => 'Cancel NFT offer',
  [TransactionTypes.NFTokenAcceptOffer]: () => 'Accept NFT offer'
};

export const formatTransaction = (
  transaction: AccountTransaction,
  publicAddress: string
): string => {
  if (!transaction.tx) {
    return 'Unsupported transaction';
  }

  const txType = transaction.tx.TransactionType;
  const formatter = transactionMappers[txType as keyof typeof transactionMappers];

  // If formatter doesn't exist for this txType, return the txType as default message
  return formatter ? formatter(transaction, publicAddress) : txType;
};

export const formatDate = (unixTimestamp: number): string => {
  return unix(946684800 + unixTimestamp).format('MMM DD, YYYY - HH:mm');
};

export const TransactionListing: FC<TransactionListingProps> = ({ transactions }) => {
  const [openedTx, setOpenedTx] = useState<AccountTransaction | null>(null);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { getCurrentWallet } = useWallet();
  const wallet = getCurrentWallet();

  const handleClick = useCallback((transaction: AccountTransaction) => {
    setOpenedTx(transaction);
  }, []);

  const handleClose = useCallback(() => {
    setOpenedTx(null);
  }, []);

  const groupTransactionsByDate = useCallback(
    (transactions: AccountTransaction[]): Map<string, AccountTransaction[]> => {
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
    },
    []
  );

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

  const filteredTransactions = filterTypes.length
    ? transactions.filter((tx) => filterTypes.includes(tx.tx?.TransactionType || ''))
    : transactions;

  return (
    <>
      <TransactionFilters
        transactions={transactions}
        filterTypes={filterTypes}
        setFilterTypes={setFilterTypes}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
      <List dense style={{ paddingTop: 0 }}>
        {Array.from(groupTransactionsByDate(filteredTransactions)).map(
          ([date, transactionsForDate]) => (
            <div key={date}>
              <Typography
                style={{ marginTop: '0', marginBottom: '5px', fontSize: '14px', fontWeight: '400' }}
              >
                {date}
              </Typography>
              {transactionsForDate.map((transaction, index) => (
                <div key={transaction.tx?.hash ?? index}>
                  <Paper
                    elevation={5}
                    style={{
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleClick(transaction)}
                  >
                    <ListItem>
                      <ListItemIcon>
                        <TransactionIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={formatTransaction(transaction, wallet.publicAddress)}
                        secondary={
                          transaction.tx?.date ? formatDate(transaction.tx?.date) : undefined
                        }
                      />
                    </ListItem>
                  </Paper>
                </div>
              ))}
            </div>
          )
        )}
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

import React, { FC, useCallback, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import TransactionIcon from '@mui/icons-material/CompareArrows';
import {
  AppBar,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Slide,
  Toolbar,
  Typography
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { unix } from 'moment';
import { convertHexToString, DepositPreauth, dropsToXrp, Payment, SetRegularKey } from 'xrpl';

import { useWallet } from '../../../contexts';
import { AccountTransaction, TransactionTypes } from '../../../types';
import { formatAmount, formatFlagsToNumber } from '../../../utils';
import { InformationMessage } from '../../molecules';
import { PageWithSpinner } from '../../templates';

export interface TransactionListingProps {
  transactions: AccountTransaction[];
}

interface ExtendedAccountTransaction extends AccountTransaction {
  touched: boolean;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

const formatTransaction = (transaction: AccountTransaction, publicAddress: string): string => {
  if (!transaction.tx) {
    return 'Unsupported transaction';
  }

  const txType = transaction.tx.TransactionType;
  const formatter = transactionMappers[txType as keyof typeof transactionMappers];

  // If formatter doesn't exist for this txType, return the txType as default message
  return formatter ? formatter(transaction, publicAddress) : txType;
};

const renderDestinationField = (transaction: AccountTransaction): JSX.Element | null => {
  if (transaction.tx && 'Destination' in transaction.tx) {
    return (
      <ListItem style={{ padding: '8px 24px' }}>
        <ListItemText primary="Destination" secondary={transaction.tx?.Destination} />
      </ListItem>
    );
  }
  return null;
};

const formatDate = (unixTimestamp: number): string => {
  return unix(946684800 + unixTimestamp).format('MMM DD, YYYY - HH:mm');
};

export const TransactionListing: FC<TransactionListingProps> = ({ transactions }) => {
  const { getCurrentWallet } = useWallet();

  const [tx, setTx] = useState<ExtendedAccountTransaction[]>(
    transactions.length > 0 ? transactions.map((t) => ({ ...t, touched: false })) : []
  );
  const wallet = getCurrentWallet();

  const handleClick = useCallback(
    (index: number) => {
      const newTx = [...tx];
      newTx[index].touched = !newTx[index].touched;
      setTx(newTx);
    },
    [tx]
  );

  const handleClose = useCallback(
    (index: number) => {
      const newTx = [...tx];
      newTx[index].touched = false;
      setTx(newTx);
    },
    [tx]
  );

  const groupTransactionsByDate = useCallback(
    (transactions: ExtendedAccountTransaction[]): Map<string, ExtendedAccountTransaction[]> => {
      const grouped = new Map<string, ExtendedAccountTransaction[]>();

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

  if (tx.length === 0) {
    return (
      <InformationMessage title="No transactions to show">
        <div style={{ marginBottom: '5px' }}>
          There are no history of transactions with this wallet.
        </div>
      </InformationMessage>
    );
  }

  return (
    <List dense style={{ paddingTop: 0 }}>
      {Array.from(groupTransactionsByDate(tx)).map(([date, transactionsForDate]) => (
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
                onClick={() => handleClick(index)}
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
              <Dialog
                open={transaction.touched}
                TransitionComponent={Transition}
                fullScreen
                data-testid="dialog"
              >
                <AppBar sx={{ position: 'relative' }}>
                  <Toolbar>
                    <IconButton
                      edge="start"
                      color="inherit"
                      aria-label="close"
                      onClick={() => handleClose(index)}
                      style={{ cursor: 'pointer' }}
                      data-testid="close-button"
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="p">
                      Transaction Details
                    </Typography>
                  </Toolbar>
                </AppBar>
                <List sx={{ width: '100%', wordBreak: 'break-word' }}>
                  <ListItem style={{ padding: '8px 24px' }}>
                    <ListItemText primary="Account" secondary={transaction.tx?.Account} />
                  </ListItem>
                  <Divider light />
                  {renderDestinationField(transaction)}
                  <Divider light />
                  <ListItem style={{ padding: '8px 24px' }}>
                    <ListItemText
                      primary="Transaction"
                      secondary={formatTransaction(transaction, wallet.publicAddress)}
                    />
                  </ListItem>
                  <Divider light />
                  <ListItem style={{ padding: '8px 24px' }}>
                    <ListItemText
                      primary="Fees"
                      secondary={dropsToXrp(Number(transaction.tx?.Fee))}
                    />
                  </ListItem>
                  <Divider light />
                  <ListItem style={{ padding: '8px 24px' }}>
                    <ListItemText
                      primary="Date"
                      secondary={
                        transaction.tx?.date ? formatDate(transaction.tx?.date) : undefined
                      }
                    />
                  </ListItem>
                  <Divider light />
                  {transaction.tx?.Memos?.[0]?.Memo?.MemoData ? (
                    <>
                      <ListItem style={{ padding: '8px 24px' }}>
                        <ListItemText
                          primary="Memo"
                          secondary={convertHexToString(transaction.tx?.Memos?.[0]?.Memo?.MemoData)}
                        />
                      </ListItem>
                      <Divider light />
                    </>
                  ) : null}
                  {transaction.meta &&
                  typeof transaction.meta === 'object' &&
                  'nftoken_id' in transaction.meta ? (
                    <>
                      <ListItem style={{ padding: '8px 24px' }}>
                        <ListItemText
                          primary="NFT Token ID"
                          secondary={(transaction.meta as any).nftoken_id}
                        />
                      </ListItem>
                      <Divider light />
                    </>
                  ) : null}
                  {transaction.meta &&
                  typeof transaction.meta === 'object' &&
                  'offer_id' in transaction.meta ? (
                    <>
                      <ListItem style={{ padding: '8px 24px' }}>
                        <ListItemText
                          primary="Offer ID"
                          secondary={(transaction.meta as any).offer_id}
                        />
                      </ListItem>
                      <Divider light />
                    </>
                  ) : null}
                  <ListItem style={{ padding: '8px 24px' }}>
                    <ListItemText primary="Transaction Hash" secondary={transaction.tx?.hash} />
                  </ListItem>
                  <Divider light />
                  {transaction.tx &&
                  'DestinationTag' in transaction.tx &&
                  transaction.tx?.DestinationTag ? (
                    <>
                      <ListItem style={{ padding: '8px 24px' }}>
                        <ListItemText
                          primary="Destination Tag"
                          secondary={transaction.tx?.DestinationTag}
                        />
                      </ListItem>
                      <Divider light />
                    </>
                  ) : null}
                  {transaction.tx && 'Flags' in transaction.tx && transaction.tx?.Flags ? (
                    <>
                      <ListItem style={{ padding: '8px 24px' }}>
                        <ListItemText
                          primary="Flags"
                          secondary={formatFlagsToNumber(transaction.tx)}
                        />
                      </ListItem>
                      <Divider light />
                    </>
                  ) : null}
                  <ListItem style={{ padding: '8px 24px' }}>
                    <ListItemText primary="Ledger Index" secondary={transaction.tx?.ledger_index} />
                  </ListItem>
                  <ListItem style={{ padding: '8px 24px' }}>
                    <ListItemText primary="Sequence" secondary={transaction.tx?.Sequence} />
                  </ListItem>
                </List>
              </Dialog>
            </div>
          ))}
        </div>
      ))}
    </List>
  );
};

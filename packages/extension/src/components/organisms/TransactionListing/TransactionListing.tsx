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
import { convertHexToString, dropsToXrp } from 'xrpl';

import { useWallet } from '../../../contexts';
import { AccountTransaction, TransactionTypes } from '../../../types';
import { formatAmount, formatFlagsToNumber } from '../../../utils';
import { InformationMessage } from '../../molecules';
import { PageWithSpinner } from '../../templates';

export interface TransactionListingProps {
  transactions: AccountTransaction[];
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const formatTransaction = (transaction: AccountTransaction, publicAddress: string): string => {
  switch (transaction.tx?.TransactionType) {
    case TransactionTypes.Payment:
      // Might need to handle more use case
      const amount = formatAmount(transaction.tx.Amount);
      if (transaction.tx.Destination === publicAddress) {
        return `Payment received - ${amount}`;
      }
      return `Payment sent - ${amount}`;
    case TransactionTypes.TrustSet: {
      // Might need to handle more use case
      return 'TrustLine transaction';
    }
    case TransactionTypes.EscrowCreate:
      return 'Create escrow';
    case TransactionTypes.EscrowFinish:
      return 'Finish escrow';
    case TransactionTypes.EscrowCancel:
      return 'Cancel escrow';
    case TransactionTypes.AccountSet:
      // Might need to handle more use cases here
      return 'Edit account';
    case TransactionTypes.SignerListSet:
      return 'Set Signer List';
    case TransactionTypes.OfferCreate:
      // Might need to handle more use cases here
      return 'Create offer';
    case TransactionTypes.OfferCancel:
      return 'Cancel offer';
    case TransactionTypes.AccountDelete:
      return 'Delete Account';
    case TransactionTypes.SetRegularKey:
      if (transaction.tx.RegularKey) {
        return 'Set Regular Key';
      }
      return 'Remove Regular Key';
    case TransactionTypes.DepositPreauth:
      if (transaction.tx.Authorize) {
        return 'Authorize deposit';
      }
      return 'Unauthorize deposit';
    case TransactionTypes.CheckCreate:
      return 'Create check';
    case TransactionTypes.CheckCash:
      return 'Cash check';
    case TransactionTypes.CheckCancel:
      return 'Cancel check';
    case TransactionTypes.TicketCreate:
      return 'Create ticket';
    case TransactionTypes.PaymentChannelCreate:
      return 'Create payment channel';
    case TransactionTypes.PaymentChannelClaim:
      return 'Claim payment channel';
    case TransactionTypes.PaymentChannelFund:
      return 'Fund payment channel';
    case TransactionTypes.NFTokenMint:
      return 'Mint NFT';
    case TransactionTypes.NFTokenBurn:
      return 'Burn NFT';
    case TransactionTypes.NFTokenCreateOffer:
      return 'Create NFT offer';
    case TransactionTypes.NFTokenCancelOffer:
      return 'Cancel NFT offer';
    case TransactionTypes.NFTokenAcceptOffer:
      return 'Accept NFT offer';
    default:
      return 'Unsupported transaction';
  }
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
  return unix(946684800 + unixTimestamp).format('DD MMMM YYYY - HH:mm');
};

export const TransactionListing: FC<TransactionListingProps> = ({ transactions }) => {
  const { getCurrentWallet } = useWallet();

  const [tx, setTx] = useState(
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
    <List dense>
      {tx.map((transaction, index) => (
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
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
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
                <ListItemText primary="Fees" secondary={dropsToXrp(Number(transaction.tx?.Fee))} />
              </ListItem>
              <Divider light />
              <ListItem style={{ padding: '8px 24px' }}>
                <ListItemText
                  primary="Date"
                  secondary={transaction.tx?.date ? formatDate(transaction.tx?.date) : undefined}
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
                    <ListItemText primary="Flags" secondary={formatFlagsToNumber(transaction.tx)} />
                  </ListItem>
                  <Divider light />
                </>
              ) : null}
              <ListItem style={{ padding: '8px 24px' }}>
                <ListItemText primary="Ledger Index" secondary={transaction.tx?.ledger_index} />
              </ListItem>
            </List>
          </Dialog>
        </div>
      ))}
    </List>
  );
};

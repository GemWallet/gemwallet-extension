import React, { FC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import { convertHexToString, dropsToXrp } from 'xrpl';

import { AccountTransaction } from '../../../types';
import { formatFlagsToNumber } from '../../../utils';
import { formatDate, formatTransaction } from './TransactionListing';

interface TransactionDetailsProps {
  transaction: AccountTransaction | null;
  publicAddress: string;
  handleClose: () => void;
}

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

export const TransactionDetails: FC<TransactionDetailsProps> = ({
  transaction,
  publicAddress,
  handleClose
}) => {
  if (!transaction) {
    return null;
  }

  return (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={() => handleClose()}
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
            secondary={formatTransaction(transaction, publicAddress)}
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
              <ListItemText primary="Offer ID" secondary={(transaction.meta as any).offer_id} />
            </ListItem>
            <Divider light />
          </>
        ) : null}
        <ListItem style={{ padding: '8px 24px' }}>
          <ListItemText primary="Transaction Hash" secondary={transaction.tx?.hash} />
        </ListItem>
        <Divider light />
        {transaction.tx && 'DestinationTag' in transaction.tx && transaction.tx?.DestinationTag ? (
          <>
            <ListItem style={{ padding: '8px 24px' }}>
              <ListItemText primary="Destination Tag" secondary={transaction.tx?.DestinationTag} />
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
        <ListItem style={{ padding: '8px 24px' }}>
          <ListItemText primary="Sequence" secondary={transaction.tx?.Sequence} />
        </ListItem>
      </List>
    </>
  );
};

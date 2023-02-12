import { FC } from 'react';

import TransactionIcon from '@mui/icons-material/CompareArrows';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { unix } from 'moment';
import { dropsToXrp } from 'xrpl';

import { useWallet } from '../../../contexts';
import { AccountTransaction, TransactionTypes } from '../../../types';
import { formatToken } from '../../../utils';
import { InformationMessage } from '../../molecules';
import { PageWithSpinner } from '../../templates';

export interface TransactionListingProps {
  transactions: AccountTransaction[];
}

const formatTransaction = (transaction: AccountTransaction, publicAddress: string): string => {
  switch (transaction.tx?.TransactionType) {
    case TransactionTypes.Payment:
      // Might need to handle more use case
      const amount =
        typeof transaction.tx.Amount === 'string'
          ? formatToken(Number(dropsToXrp(transaction.tx.Amount)), 'XRP')
          : formatToken(Number(transaction.tx.Amount.value), transaction.tx.Amount.currency);
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

const formatDate = (unixTimestamp: number): string => {
  return unix(946684800 + unixTimestamp).format('DD MMMM YYYY - HH:mm');
};

export const TransactionListing: FC<TransactionListingProps> = ({ transactions }) => {
  const { getCurrentWallet } = useWallet();

  const wallet = getCurrentWallet();

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
    <List dense>
      {transactions.map((transaction, index) => (
        <ListItem key={transaction.tx?.hash ?? index}>
          <ListItemIcon>
            <TransactionIcon />
          </ListItemIcon>
          <ListItemText
            primary={formatTransaction(transaction, wallet.publicAddress)}
            secondary={transaction.tx?.date ? formatDate(transaction.tx?.date) : undefined}
          />
        </ListItem>
      ))}
    </List>
  );
};

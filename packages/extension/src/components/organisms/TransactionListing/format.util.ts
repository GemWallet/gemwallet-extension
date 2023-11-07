import { unix } from 'moment';
import { DepositPreauth, Payment, SetRegularKey } from 'xrpl';

import { AccountTransaction, TransactionTypes } from '../../../types';
import { formatAmount } from '../../../utils';

export const formatDate = (unixTimestamp: number): string => {
  return unix(946684800 + unixTimestamp).format('MMM DD, YYYY - HH:mm');
};

type TransactionFormatter = (
  transaction: AccountTransaction,
  publicAddress: string,
  mainToken: string
) => string;

const transactionMappers: Record<TransactionTypes, TransactionFormatter> = {
  [TransactionTypes.Payment]: (transaction, publicAddress, mainToken) => {
    const amount = formatAmount((transaction.tx as Payment).Amount, mainToken);
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
  publicAddress: string,
  mainToken: string
): string => {
  if (!transaction.tx) {
    return 'Unsupported transaction';
  }

  const txType = transaction.tx.TransactionType;
  const formatter = transactionMappers[txType as keyof typeof transactionMappers];

  // If formatter doesn't exist for this txType, return the txType as default message
  return formatter ? formatter(transaction, publicAddress, mainToken) : txType;
};

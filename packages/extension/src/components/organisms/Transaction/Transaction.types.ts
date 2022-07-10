import { TransactionStatus } from '@gemwallet/api/src/types/transaction.types';

export type TransactionProps = {
  transaction: TransactionStatus;
};

export type LogoStyle = {
  width: string;
  height: string;
  marginTop?: string;
};

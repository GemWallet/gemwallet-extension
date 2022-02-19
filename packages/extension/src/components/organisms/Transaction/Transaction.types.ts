import { TransactionStatus } from '@gemwallet/constants/src/transaction.types';

export type PropType = {
  transaction: TransactionStatus;
};

export type LogoStyle = {
  width: string;
  height: string;
  marginTop?: string;
};

import { TransactionStatus } from '@gemwallet/api/src/constants/transaction.types';

export type PropType = {
  transaction: TransactionStatus;
};

export type LogoStyle = {
  width: string;
  height: string;
  marginTop?: string;
};

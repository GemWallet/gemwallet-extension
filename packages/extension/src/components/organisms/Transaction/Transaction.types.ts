import { TransactionStatus } from '@gemwallet/api';

export type TransactionProps = {
  transaction: TransactionStatus;
};

export type LogoStyle = {
  width: string;
  height: string;
  marginTop?: string;
};

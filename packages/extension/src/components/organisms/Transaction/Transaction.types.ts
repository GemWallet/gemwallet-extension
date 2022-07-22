import { TransactionStatus } from '../../../types';

export type TransactionProps = {
  transaction: TransactionStatus;
  failureReason?: string;
};

export type LogoStyle = {
  width: string;
  height: string;
  marginTop?: string;
};

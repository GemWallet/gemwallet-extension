type transactionState = 'success' | 'rejected';

export type PropType = {
  transaction: string;
  handleTransaction: (transactionState: transactionState) => void;
};

export type LogoStyle = {
  width: string;
  height: string;
  marginTop?: string;
};

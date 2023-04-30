import { FC, useCallback, useState } from 'react';

import { Memo } from 'xrpl/dist/npm/models/common';

import { ConfirmPayment } from './ConfirmPayment';
import { PreparePayment } from './PreparePayment';

export const SendPayment: FC = () => {
  const [payment, setPayment] = useState<{
    address: string;
    token: string;
    amount: string;
    memos?: Memo[];
    destinationTag?: number;
  } | null>(null);

  const handlePreparePayment = useCallback((payment) => {
    setPayment(payment);
  }, []);

  if (payment) {
    return <ConfirmPayment payment={payment} onClickBack={() => setPayment(null)} />;
  }
  return <PreparePayment onSendPaymentClick={handlePreparePayment} />;
};

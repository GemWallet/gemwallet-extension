import { FC, useCallback, useState } from 'react';

import { Memo } from '@gemwallet/constants';

import { ConfirmPayment } from './ConfirmPayment';
import { PreparePayment } from './PreparePayment';

type PaymentData = {
  address: string;
  token: string;
  value: string;
  memos?: Memo[];
  destinationTag?: number;
};

export const SendPayment: FC = () => {
  const [payment, setPayment] = useState<PaymentData | null>(null);

  const handlePreparePayment = useCallback((payment: PaymentData | null) => {
    setPayment(payment);
  }, []);

  if (payment) {
    return <ConfirmPayment payment={payment} />;
  }
  return <PreparePayment onSendPaymentClick={handlePreparePayment} />;
};

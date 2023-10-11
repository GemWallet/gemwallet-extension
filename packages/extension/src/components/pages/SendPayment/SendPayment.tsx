import { FC, useCallback, useState } from 'react';

import { Memo } from '@gemwallet/constants';

import { ConfirmPayment } from './ConfirmPayment';
import { PreparePayment } from './PreparePayment';

export const SendPayment: FC = () => {
  const [payment, setPayment] = useState<{
    address: string;
    token: string;
    value: string;
    memos?: Memo[];
    destinationTag?: number;
  } | null>(null);

  const handlePreparePayment = useCallback((payment) => {
    setPayment(payment);
  }, []);

  if (payment) {
    return <ConfirmPayment payment={payment} />;
  }
  return <PreparePayment onSendPaymentClick={handlePreparePayment} />;
};

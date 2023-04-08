import { FC, useCallback, useState } from 'react';

import { ConfirmPayment } from './ConfirmPayment';
import { PreparePayment } from './PreparePayment';

export const SendPayment: FC = () => {
  const [payment, setPayment] = useState<{
    address: string;
    token: string;
    amount: string;
  } | null>(null);

  const handlePreparePayment = useCallback((payment) => {
    setPayment(payment);
  }, []);

  if (payment) {
    return <ConfirmPayment payment={payment} onClickBack={() => setPayment(null)} />;
  }
  return <PreparePayment onSendPaymentClick={handlePreparePayment} />;
};

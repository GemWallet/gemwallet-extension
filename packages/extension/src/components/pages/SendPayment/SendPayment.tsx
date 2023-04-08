import { FC } from 'react';

import { PreparePayment } from './PreparePayment';

export const SendPayment: FC = () => {
  return <PreparePayment onSendPaymentClick={(obj) => console.log(obj)} />;
};

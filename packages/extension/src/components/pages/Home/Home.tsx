import { FC } from 'react';
import { PageWithHeader } from '../../templates';
import { Wallet } from '../../molecules/Wallet';
import { useLedger } from '../../../contexts/LedgerContext';

export const Home: FC = () => {
  const { wallet } = useLedger();

  return (
    <PageWithHeader>
      <Wallet address={wallet?.address || 'Loading...'} />
    </PageWithHeader>
  );
};

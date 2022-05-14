import { FC } from 'react';
import { PageWithNavbar } from '../../templates';
import { Wallet } from '../../molecules/Wallet';
import { useLedger } from '../../../contexts/LedgerContext';

export const Home: FC = () => {
  const { wallet } = useLedger();

  return (
    <PageWithNavbar>
      <Wallet address={wallet?.address || 'Loading...'} />
    </PageWithNavbar>
  );
};

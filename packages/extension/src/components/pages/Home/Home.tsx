import { FC } from 'react';
import { PageWithHeader } from '../../templates';
import { Wallet } from '../../molecules';
import { useLedger } from '../../../contexts';

export const Home: FC = () => {
  const { wallets, selectedWallet } = useLedger();

  return (
    <PageWithHeader>
      <Wallet address={wallets?.[selectedWallet]?.publicAddress || 'Loading...'} />
    </PageWithHeader>
  );
};

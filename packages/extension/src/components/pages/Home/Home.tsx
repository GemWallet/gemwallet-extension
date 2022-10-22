import { FC } from 'react';
import { PageWithHeader } from '../../templates';
import { Wallet } from '../../molecules';
import { useWallet } from '../../../contexts';

export const Home: FC = () => {
  const { wallets, selectedWallet } = useWallet();

  return (
    <PageWithHeader>
      <Wallet address={wallets?.[selectedWallet]?.publicAddress || 'Loading...'} />
    </PageWithHeader>
  );
};

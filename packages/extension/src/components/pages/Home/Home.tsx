import { FC } from 'react';

import { useWallet } from '../../../contexts';
import { Wallet } from '../../molecules';
import { PageWithHeader } from '../../templates';

export const Home: FC = () => {
  const { wallets, selectedWallet } = useWallet();

  return (
    <PageWithHeader>
      <Wallet address={wallets?.[selectedWallet]?.publicAddress || 'Loading...'} />
    </PageWithHeader>
  );
};

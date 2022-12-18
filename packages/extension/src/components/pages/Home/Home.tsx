import { FC } from 'react';

import { useWallet } from '../../../contexts';
import { WalletDetail } from '../../organisms';
import { PageWithHeader } from '../../templates';

export const Home: FC = () => {
  const { wallets, selectedWallet } = useWallet();

  return (
    <PageWithHeader>
      <WalletDetail address={wallets?.[selectedWallet]?.publicAddress || 'Loading...'} />
    </PageWithHeader>
  );
};

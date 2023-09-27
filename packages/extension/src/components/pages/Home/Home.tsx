import { FC, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { HOME_PATH, navigation, WELCOME_PATH } from '../../../constants';
import { useWallet } from '../../../contexts';
import { TokenListing } from '../../organisms';
import { PageWithHeader, PageWithSpinner } from '../../templates';

export const Home: FC = () => {
  const navigate = useNavigate();
  const { wallets, selectedWallet } = useWallet();

  const indexDefaultNav = useMemo(
    () => navigation.findIndex((link) => link.pathname === HOME_PATH),
    []
  );

  if (wallets.length === 0) {
    navigate(WELCOME_PATH);
    return <PageWithSpinner />;
  }
  return (
    <PageWithHeader indexDefaultNav={indexDefaultNav}>
      <TokenListing address={wallets?.[selectedWallet]?.publicAddress} />
    </PageWithHeader>
  );
};

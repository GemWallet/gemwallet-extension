import { FC, useCallback } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

import { ADD_NEW_WALLET, HOME_PATH } from '../../../constants';
import { useWallet } from '../../../contexts';
import { Wallet } from '../../molecules';
import { PageWithReturn } from '../../templates';

export const ListWallets: FC = () => {
  const navigate = useNavigate();

  const { wallets, selectedWallet } = useWallet();

  const handleBack = useCallback(() => {
    navigate(HOME_PATH);
  }, [navigate]);

  const handleCreateWallet = useCallback(() => {
    navigate(ADD_NEW_WALLET);
  }, [navigate]);

  return (
    <PageWithReturn
      title="Your wallets"
      onBackClick={handleBack}
      action={{
        onClick: handleCreateWallet,
        actionIcon: <AddIcon />
      }}
    >
      <div style={{ overflowY: 'scroll', height: '518px' }}>
        {wallets.map(({ name, publicAddress }) => (
          <Wallet
            name={name}
            publicAddress={publicAddress}
            key={publicAddress}
            style={{ marginBottom: '10px' }}
          />
        ))}
      </div>
    </PageWithReturn>
  );
};

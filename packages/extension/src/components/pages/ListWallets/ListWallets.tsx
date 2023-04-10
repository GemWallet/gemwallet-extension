import { FC, useCallback } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ADD_NEW_WALLET_PATH, HOME_PATH } from '../../../constants';
import { useWallet } from '../../../contexts';
import { PageWithReturn } from '../../templates';
import { Wallet } from './Wallet';

export const ListWallets: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const { wallets, selectedWallet, selectWallet } = useWallet();

  const handleBack = useCallback(() => {
    navigate(HOME_PATH);
  }, [navigate]);

  const handleCreateWallet = useCallback(() => {
    navigate(ADD_NEW_WALLET_PATH);
  }, [navigate]);

  const handleSelectWallet = useCallback(
    (index: number) => {
      selectWallet(index);
      handleBack();
    },
    [handleBack, selectWallet]
  );

  return (
    <PageWithReturn
      title={t('TEXT_YOUR_WALLETS')}
      onBackClick={handleBack}
      action={{
        onClick: handleCreateWallet,
        actionIcon: <AddIcon />,
        ariaLabel: t('TEXT_ADD_WALLET')
      }}
    >
      <div style={{ overflowY: 'scroll', height: '518px' }} data-testid="wallet-container">
        {wallets.map(({ name, publicAddress }, index) => (
          <Wallet
            name={name}
            publicAddress={publicAddress}
            key={publicAddress}
            isSelected={selectedWallet === index}
            onClick={() => handleSelectWallet(index)}
          />
        ))}
      </div>
    </PageWithReturn>
  );
};

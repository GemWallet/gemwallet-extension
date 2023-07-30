import { FC, useCallback } from 'react';

import AddIcon from '@mui/icons-material/Add';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';

import { EventWalletChangedBackgroundMessage, GEM_WALLET } from '@gemwallet/constants';

import { ADD_NEW_WALLET_PATH, HOME_PATH } from '../../../constants';
import { useWallet } from '../../../contexts';
import { PageWithReturn } from '../../templates';
import { Wallet } from './Wallet';

export const ListWallets: FC = () => {
  const navigate = useNavigate();

  const { wallets, selectedWallet, selectWallet } = useWallet();

  const handleBack = useCallback(() => {
    navigate(HOME_PATH);
  }, [navigate]);

  const handleCreateWallet = useCallback(() => {
    navigate(ADD_NEW_WALLET_PATH);
  }, [navigate]);

  const handleSelectWallet = useCallback(
    (index: number, publicAddress: string) => {
      selectWallet(index);

      chrome.runtime
        .sendMessage<EventWalletChangedBackgroundMessage>({
          app: GEM_WALLET,
          type: 'EVENT_WALLET_CHANGED',
          source: 'GEM_WALLET_MSG_REQUEST',
          payload: {
            id: 0,
            result: {
              wallet: {
                publicAddress: publicAddress
              }
            }
          }
        })
        .catch((e) => {
          Sentry.captureException(e);
        });

      handleBack();
    },
    [handleBack, selectWallet]
  );

  return (
    <PageWithReturn
      title="Your wallets"
      onBackClick={handleBack}
      action={{
        onClick: handleCreateWallet,
        actionIcon: <AddIcon />,
        ariaLabel: 'Add wallet'
      }}
    >
      <div style={{ overflowY: 'scroll', height: '518px' }} data-testid="wallet-container">
        {wallets.map(({ name, publicAddress }, index) => (
          <Wallet
            name={name}
            publicAddress={publicAddress}
            key={publicAddress}
            isSelected={selectedWallet === index}
            onClick={() => handleSelectWallet(index, publicAddress)}
          />
        ))}
      </div>
    </PageWithReturn>
  );
};

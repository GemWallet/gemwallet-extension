import { FC, useCallback } from 'react';

import WarningIcon from '@mui/icons-material/Warning';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useWallet } from '../../../../contexts';
import { PageWithReturn } from '../../../templates';

export interface RemoveWalletProps {
  publicAddress: string;
  onBackButton: () => void;
}

export const RemoveWallet: FC<RemoveWalletProps> = ({ publicAddress, onBackButton }) => {
  const { removeWallet } = useWallet();
  const { t } = useTranslation('common');

  const handleRemove = useCallback(() => {
    removeWallet(publicAddress);
    onBackButton();
  }, [onBackButton, publicAddress, removeWallet]);

  return (
    <PageWithReturn title={t('TEXT_REMOVE_WALLET')} onBackClick={onBackButton}>
      <div
        style={{
          height: '518px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ textAlign: 'center' }}>
            <WarningIcon color="warning" fontSize="large" />
          </div>
          <Typography variant="h5" align="center">
            {t('TEXT_REMOVE_WALLET_DISCLAIMER_1')}
          </Typography>
          <Typography align="center" style={{ marginTop: '0.25rem' }}>
            {t('TEXT_REMOVE_WALLET_DISCLAIMER_2')}
          </Typography>
        </div>
        <div
          style={{
            margin: '1.5rem 0',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Button variant="outlined" size="large" style={{ width: '45%' }} onClick={onBackButton}>
            {t('TEXT_CANCEL')}
          </Button>
          <Button variant="contained" size="large" style={{ width: '45%' }} onClick={handleRemove}>
            {t('TEXT_REMOVE')}
          </Button>
        </div>
      </div>
    </PageWithReturn>
  );
};

import { FC, useCallback } from 'react';

import WarningIcon from '@mui/icons-material/Warning';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { SETTINGS_PATH } from '../../../constants';
import { useNetwork, useWallet } from '../../../contexts';
import { removeWallets } from '../../../utils';
import { PageWithReturn } from '../../templates';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const { signOut } = useWallet();
  const { resetNetwork } = useNetwork();
  const { t } = useTranslation('common');

  const handleBack = useCallback(() => {
    navigate(SETTINGS_PATH);
  }, [navigate]);

  const handleRemoveWallets = useCallback(async () => {
    await removeWallets();
    await resetNetwork();
    signOut();
  }, [resetNetwork, signOut]);

  return (
    <PageWithReturn title={t('TEXT_RESET_PASSWORD')} onBackClick={handleBack}>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginTop: '1rem',
          marginBottom: '3rem'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <WarningIcon color="warning" fontSize="large" />
        </div>
        <Typography variant="h5" align="center">
          {t('TEXT_RESET_PASSWORD_DISCLAIMER_1')}
        </Typography>
      </div>
      <Typography align="center" style={{ marginTop: '0.25rem' }}>
        {t('TEXT_RESET_PASSWORD_DISCLAIMER_2')}
      </Typography>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          margin: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Button variant="contained" size="large" onClick={handleBack}>
          {t('TEXT_CANCEL')}
        </Button>
        <Button variant="contained" size="large" onClick={handleRemoveWallets}>
          {t('TEXT_CONTINUE')}
        </Button>
      </div>
    </PageWithReturn>
  );
};

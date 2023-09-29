import { FC, useCallback, useState } from 'react';

import WarningIcon from '@mui/icons-material/Warning';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { SETTINGS_PATH } from '../../../constants';
import { useNetwork, useWallet } from '../../../contexts';
import { removeWallets } from '../../../utils';
import { PageWithReturn } from '../../templates';
import { EnterPasswordDanger } from '../EnterPasswordDanger';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const { signOut } = useWallet();
  const { resetNetwork } = useNetwork();

  const [passwordVerified, setPasswordVerified] = useState(false);

  const handlePasswordVerified = useCallback(() => {
    setPasswordVerified(true);
  }, []);

  const handleBack = useCallback(() => {
    navigate(SETTINGS_PATH);
  }, [navigate]);

  const handleRemoveWallets = useCallback(async () => {
    await removeWallets();
    await resetNetwork();
    signOut();
  }, [resetNetwork, signOut]);

  if (!passwordVerified) {
    return <EnterPasswordDanger onConfirmPassword={handlePasswordVerified} onCancel={handleBack} />;
  }

  return (
    <PageWithReturn title="Reset Password" onBackClick={handleBack}>
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
          Resetting your password will remove your secret seeds
        </Typography>
      </div>
      <Typography align="center" style={{ marginTop: '0.25rem' }}>
        This will remove all existing wallets and replace them with new ones. Make sure you have
        your existing private secret seeds backed up.
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
          Cancel
        </Button>
        <Button variant="contained" size="large" onClick={handleRemoveWallets}>
          Continue
        </Button>
      </div>
    </PageWithReturn>
  );
};

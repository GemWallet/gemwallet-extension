import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { PageWithReturn } from '../../templates';
import { removeSeed } from '../../../utils';
import { useLedger } from '../../../contexts/LedgerContext';
import { SETTINGS_PATH } from '../../../constants/routes';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const { signOut } = useLedger();

  const handleBack = useCallback(() => {
    navigate(SETTINGS_PATH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveSeed = () => {
    removeSeed().then(() => signOut());
  };

  return (
    <PageWithReturn title="Reset Password" handleBack={handleBack}>
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
        <Button variant="contained" size="large" onClick={handleRemoveSeed}>
          Continue
        </Button>
      </div>
    </PageWithReturn>
  );
};

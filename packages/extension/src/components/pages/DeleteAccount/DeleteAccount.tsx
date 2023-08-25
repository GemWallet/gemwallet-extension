import { FC, useState, useCallback } from 'react';

import WarningIcon from '@mui/icons-material/Warning';
import { Button, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { SETTINGS_PATH } from '../../../constants';
import { PageWithReturn } from '../../templates';
import { EnterPasswordDanger } from '../EnterPasswordDanger';
import { DeleteAccountConfirm } from './DeleteAccountConfirm';
import { DeleteAccountForm } from './DeleteAccountForm';

export const DeleteAccount: FC = () => {
  const navigate = useNavigate();

  const [passwordVerified, setPasswordVerified] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [isConfirmationStep, setIsConfirmationStep] = useState(false);
  const [isFinalConfirmationStep, setIsFinalConfirmationStep] = useState(false);

  const handlePasswordVerified = useCallback(() => {
    setPasswordVerified(true);
  }, []);

  const handleBack = useCallback(() => {
    navigate(SETTINGS_PATH);
  }, [navigate]);

  const handleFormDeleteAccount = useCallback(() => {
    setIsConfirmationStep(true);
  }, []);

  const handleFormFinalConfirmation = useCallback(() => {
    setIsConfirmationStep(false);
    setIsFinalConfirmationStep(true);
  }, []);

  if (!passwordVerified) {
    return <EnterPasswordDanger onConfirmPassword={handlePasswordVerified} onCancel={handleBack} />;
  }

  if (isConfirmationStep) {
    return (
      <DeleteAccountForm
        address={address}
        setAddress={setAddress}
        onConfirm={handleFormFinalConfirmation}
      />
    );
  }

  if (isFinalConfirmationStep) {
    return <DeleteAccountConfirm destinationAddress={address} onCancel={handleBack} />;
  }

  return (
    <PageWithReturn title="Delete Account" onBackClick={handleBack}>
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
        <Typography variant="h5" align="center" color="red">
          You are about to permanently delete your account from the XRPL.
        </Typography>
      </div>
      <Typography align="center" style={{ marginTop: '0.5rem' }}>
        This will permanently delete your account from the XRPL.
      </Typography>
      <Typography align="center" style={{ marginTop: '0.5rem' }}>
        In the next step, you will be asked to enter the destination address to transfer your
        remaining XRP funds to.
      </Typography>
      <Typography align="center" style={{ marginTop: '0.5rem' }}>
        Once you delete your account, there is no going back. Please be certain.
      </Typography>
      <Typography align="center" style={{ marginTop: '0.5rem' }}>
        <Link
          href="https://xrpl.org/accountdelete.html?utm_source=gemwallet.app"
          target="_blank"
          rel="noreferrer"
        >
          Learn more about account deletion
        </Link>
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
        <Button variant="outlined" size="large" onClick={handleFormDeleteAccount} color="error">
          Continue
        </Button>
      </div>
    </PageWithReturn>
  );
};

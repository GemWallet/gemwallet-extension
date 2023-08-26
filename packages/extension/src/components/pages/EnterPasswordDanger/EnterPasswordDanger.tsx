import { FC, useCallback, useRef, useState } from 'react';

import WarningIcon from '@mui/icons-material/Warning';
import { Button, TextField, Typography } from '@mui/material';

import { useWallet } from '../../../contexts';
import { useKeyUp } from '../../../hooks';
import { PageWithReturn } from '../../templates';

interface EnterPasswordDangerProps {
  onConfirmPassword: () => void;
  onCancel: () => void;
}

export const EnterPasswordDanger: FC<EnterPasswordDangerProps> = ({
  onConfirmPassword,
  onCancel
}) => {
  const [passwordError, setPasswordError] = useState<string>('');
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const { signIn } = useWallet();

  const handleConfirmPassword = useCallback(() => {
    //TODO: See how to refactor this maybe just comparing with a password string from the context would be enough
    const passwordValue = passwordRef.current?.value;
    if (passwordValue && signIn(passwordValue)) {
      onConfirmPassword();
    }
    setPasswordError('Incorrect password');
  }, [onConfirmPassword, signIn]);

  const handleTextFieldChange = useCallback(() => {
    setPasswordError('');
  }, []);

  // Handle Confirm Password step button by pressing 'Enter'
  useKeyUp('Enter', handleConfirmPassword);

  return (
    <PageWithReturn title="Enter your password" onBackClick={onCancel}>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginTop: '1rem',
          marginBottom: '4rem'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <WarningIcon color="warning" fontSize="large" />
        </div>
        <Typography variant="h5" align="center">
          The operation you are about to perform is sensitive
        </Typography>
      </div>
      <Typography align="center" style={{ marginTop: '0.5rem' }}>
        Please enter your password to continue.
      </Typography>
      <TextField
        fullWidth
        id="password"
        name="password"
        label="Password"
        inputRef={passwordRef}
        error={!!passwordError}
        onChange={handleTextFieldChange}
        helperText={passwordError}
        type="password"
        style={{ marginBottom: !passwordError ? '33px' : '10px', marginTop: '1.5rem' }}
        autoComplete="off"
      />
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
        <Button variant="contained" size="large" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" size="large" onClick={handleConfirmPassword}>
          Continue
        </Button>
      </div>
    </PageWithReturn>
  );
};

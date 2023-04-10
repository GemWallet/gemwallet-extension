import { FC, useCallback, useState, useRef } from 'react';

import { Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LIST_WALLETS_PATH } from '../../../../constants';
import { useWallet } from '../../../../contexts';
import { useKeyUp } from '../../../../hooks';
import { PageWithReturn } from '../../../templates';

export interface ConfirmPasswordProps {
  setPassword: React.Dispatch<React.SetStateAction<string | undefined>>;
  onConfirmPassword: () => void;
}

export const ConfirmPassword: FC<ConfirmPasswordProps> = ({ setPassword, onConfirmPassword }) => {
  const navigate = useNavigate();
  const { signIn } = useWallet();
  const [passwordError, setPasswordError] = useState<string>('');
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleBack = useCallback(() => {
    navigate(LIST_WALLETS_PATH);
  }, [navigate]);

  const handleTextFieldChange = useCallback(() => {
    setPasswordError('');
  }, []);

  const handleConfirmPassword = useCallback(() => {
    //TODO: See how to refactor this maybe just comparing with a password string from the context would be enough
    const passwordValue = passwordRef.current?.value;
    if (passwordValue && signIn(passwordValue)) {
      setPassword(passwordValue);
      onConfirmPassword();
    }
    setPasswordError('Incorrect password');
  }, [onConfirmPassword, setPassword, signIn]);

  // Handle Confirm Password step button by pressing 'Enter'
  useKeyUp('Enter', handleConfirmPassword);
  const { t } = useTranslation('common');

  return (
    <PageWithReturn title={t('TEXT_ADD_WALLET')} onBackClick={handleBack} style={{ height: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          paddingBottom: '10px'
        }}
      >
        <Typography variant="h6" style={{ marginTop: '80px' }} align="center">
          {t('TEXT_PLEASE_CONFIRM_PASSWORD')}
        </Typography>
        <div>
          <TextField
            fullWidth
            id="password"
            name="password"
            label={t('TEXT_PASSWORD')}
            inputRef={passwordRef}
            error={!!passwordError}
            onChange={handleTextFieldChange}
            helperText={passwordError}
            type="password"
            style={{ marginBottom: !passwordError ? '33px' : '10px' }}
            autoComplete="off"
          />
          <Button fullWidth variant="contained" onClick={handleConfirmPassword}>
            {t('TEXT_CONFIRM_PASSWORD')}
          </Button>
        </div>
      </div>
    </PageWithReturn>
  );
};

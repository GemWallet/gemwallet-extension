import { useState, useEffect, FC, useCallback, useRef } from 'react';

import { Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  CANCEL_NFT_OFFER_PATH,
  CREATE_NFT_OFFER_PATH,
  HOME_PATH,
  PARAMETER_SHARE_ADDRESS,
  PARAMETER_SIGN_MESSAGE,
  PARAMETER_TRANSACTION_PAYMENT,
  RESET_PASSWORD_PATH,
  SIGN_MESSAGE_PATH,
  SHARE_PUBLIC_ADDRESS_PATH,
  STORAGE_WALLETS,
  TRANSACTION_PATH,
  WELCOME_PATH,
  PARAMETER_SHARE_PUBLIC_KEY,
  SHARE_PUBLIC_KEY_PATH,
  ADD_NEW_TRUSTLINE_PATH,
  PARAMETER_TRANSACTION_TRUSTLINE,
  PARAMETER_SHARE_NFT,
  SHARE_NFT_PATH,
  MINT_NFT_PATH,
  PARAMETER_TRANSACTION_MINT_NFT,
  PARAMETER_TRANSACTION_CANCEL_NFT_OFFER,
  PARAMETER_TRANSACTION_CREATE_NFT_OFFER
} from '../../../constants';
import { useWallet } from '../../../contexts';
import { useKeyUp } from '../../../hooks/useKeyUp';
import { loadData } from '../../../utils';
import { Logo } from '../../atoms/Logo';

export const Login: FC = () => {
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { search } = useLocation();
  const { signIn, wallets, selectedWallet } = useWallet();
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const navigateToPath = useCallback(() => {
    if (search.includes(PARAMETER_TRANSACTION_PAYMENT)) {
      navigate(`${TRANSACTION_PATH}${search}`);
    } else if (search.includes(PARAMETER_SHARE_ADDRESS)) {
      navigate(`${SHARE_PUBLIC_ADDRESS_PATH}${search}`);
    } else if (search.includes(PARAMETER_SHARE_PUBLIC_KEY)) {
      navigate(`${SHARE_PUBLIC_KEY_PATH}${search}`);
    } else if (search.includes(PARAMETER_SIGN_MESSAGE)) {
      navigate(`${SIGN_MESSAGE_PATH}${search}`);
    } else if (search.includes(PARAMETER_TRANSACTION_TRUSTLINE)) {
      navigate(`${ADD_NEW_TRUSTLINE_PATH}${search}`);
    } else if (search.includes(PARAMETER_SHARE_NFT)) {
      navigate(`${SHARE_NFT_PATH}${search}`);
    } else if (search.includes(PARAMETER_TRANSACTION_MINT_NFT)) {
      navigate(`${MINT_NFT_PATH}${search}`);
    } else if (search.includes(PARAMETER_TRANSACTION_CREATE_NFT_OFFER)) {
      navigate(`${CREATE_NFT_OFFER_PATH}${search}`);
    } else if (search.includes(PARAMETER_TRANSACTION_CANCEL_NFT_OFFER)) {
      navigate(`${CANCEL_NFT_OFFER_PATH}${search}`);
    } else {
      navigate(`${HOME_PATH}${search}`);
    }
  }, [navigate, search]);

  useEffect(() => {
    // Check if we are still logged-in
    if (wallets?.[selectedWallet]) {
      navigateToPath();
      // We check if a wallet is saved
    } else if (!loadData(STORAGE_WALLETS)) {
      navigate(`${WELCOME_PATH}${search}`);
    }
  }, [navigate, navigateToPath, search, selectedWallet, wallets]);

  const handleUnlock = useCallback(() => {
    const passwordValue = passwordRef.current?.value;
    if (passwordValue && signIn(passwordValue)) {
      navigateToPath();
    } else {
      setPasswordError('Incorrect password');
    }
  }, [signIn, navigateToPath]);

  // Handle Login step button by pressing 'Enter'
  useKeyUp('Enter', handleUnlock);

  const handleTextFieldChange = useCallback(() => {
    setPasswordError('');
  }, []);

  const handleReset = useCallback(() => {
    navigate(RESET_PASSWORD_PATH);
  }, [navigate]);

  return (
    <Container
      component="main"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        padding: '30px 16px'
      }}
    >
      <Container style={{ textAlign: 'center', marginTop: '30%' }}>
        <Logo style={{ transform: 'scale(2)' }} />
        <Typography variant="h4" component="h1" style={{ marginTop: '30px' }}>
          GemWallet
        </Typography>
        <Typography variant="h6" component="h2" style={{ marginTop: '30px' }}>
          Internet cryptocurrency payments made easy
        </Typography>
      </Container>
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '135px'
        }}
      >
        <TextField
          fullWidth
          autoFocus
          id="password"
          name="password"
          label="Password"
          inputRef={passwordRef}
          error={!!passwordError}
          onChange={handleTextFieldChange}
          helperText={passwordError}
          type="password"
          style={{ marginBottom: !passwordError ? '33px' : '10px' }}
        />
        <Button variant="contained" onClick={handleUnlock}>
          Unlock
        </Button>
        <Typography
          variant="caption"
          display="block"
          align="center"
          style={{ marginTop: '10px', cursor: 'pointer' }}
          onClick={handleReset}
        >
          Reset Password
        </Typography>
      </Container>
    </Container>
  );
};

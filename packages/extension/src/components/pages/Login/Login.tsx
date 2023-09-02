import { useState, useEffect, FC, useCallback, useRef, ChangeEvent } from 'react';

import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography
} from '@mui/material';
import * as Sentry from '@sentry/react';
import { useNavigate, useLocation } from 'react-router-dom';

import { EventLoginBackgroundMessage, GEM_WALLET } from '@gemwallet/constants';

import {
  ACCEPT_NFT_OFFER_PATH,
  ADD_NEW_TRUSTLINE_PATH,
  BURN_NFT_PATH,
  CANCEL_NFT_OFFER_PATH,
  CANCEL_OFFER_PATH,
  CREATE_NFT_OFFER_PATH,
  CREATE_OFFER_PATH,
  HOME_PATH,
  MINT_NFT_PATH,
  PARAMETER_SHARE_ADDRESS,
  PARAMETER_SHARE_NFT,
  PARAMETER_SHARE_PUBLIC_KEY,
  PARAMETER_SIGN_MESSAGE,
  PARAMETER_SIGN_TRANSACTION,
  PARAMETER_SUBMIT_TRANSACTION,
  PARAMETER_TRANSACTION_ACCEPT_NFT_OFFER,
  PARAMETER_TRANSACTION_BURN_NFT,
  PARAMETER_TRANSACTION_CANCEL_NFT_OFFER,
  PARAMETER_TRANSACTION_CANCEL_OFFER,
  PARAMETER_TRANSACTION_CREATE_NFT_OFFER,
  PARAMETER_TRANSACTION_CREATE_OFFER,
  PARAMETER_TRANSACTION_MINT_NFT,
  PARAMETER_TRANSACTION_PAYMENT,
  PARAMETER_TRANSACTION_SET_ACCOUNT,
  PARAMETER_TRANSACTION_TRUSTLINE,
  RESET_PASSWORD_PATH,
  SET_ACCOUNT_PATH,
  SHARE_NFT_PATH,
  SHARE_PUBLIC_ADDRESS_PATH,
  SIGN_MESSAGE_PATH,
  SIGN_TRANSACTION_PATH,
  SHARE_PUBLIC_KEY_PATH,
  STORAGE_WALLETS,
  SUBMIT_TRANSACTION_PATH,
  TRANSACTION_PATH,
  WELCOME_PATH,
  PARAMETER_SUBMIT_TRANSACTIONS_BULK,
  SUBMIT_TRANSACTIONS_BULK_PATH
} from '../../../constants';
import { useWallet } from '../../../contexts';
import { useKeyUp } from '../../../hooks/useKeyUp';
import { loadData } from '../../../utils';
import { loadRememberSessionState, saveRememberSessionState } from '../../../utils/login';
import { Logo } from '../../atoms/Logo';

export const Login: FC = () => {
  const [passwordError, setPasswordError] = useState('');
  const [rememberSession, setRememberSession] = useState(false);
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
    } else if (search.includes(PARAMETER_SUBMIT_TRANSACTION)) {
      navigate(`${SUBMIT_TRANSACTION_PATH}${search}`);
    } else if (search.includes(PARAMETER_SIGN_TRANSACTION)) {
      navigate(`${SIGN_TRANSACTION_PATH}${search}`);
    } else if (search.includes(PARAMETER_SUBMIT_TRANSACTIONS_BULK)) {
      navigate(`${SUBMIT_TRANSACTIONS_BULK_PATH}${search}`);
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
    } else if (search.includes(PARAMETER_TRANSACTION_ACCEPT_NFT_OFFER)) {
      navigate(`${ACCEPT_NFT_OFFER_PATH}${search}`);
    } else if (search.includes(PARAMETER_TRANSACTION_BURN_NFT)) {
      navigate(`${BURN_NFT_PATH}${search}`);
    } else if (search.includes(PARAMETER_TRANSACTION_SET_ACCOUNT)) {
      navigate(`${SET_ACCOUNT_PATH}${search}`);
    } else if (search.includes(PARAMETER_TRANSACTION_CREATE_OFFER)) {
      navigate(`${CREATE_OFFER_PATH}${search}`);
    } else if (search.includes(PARAMETER_TRANSACTION_CANCEL_OFFER)) {
      navigate(`${CANCEL_OFFER_PATH}${search}`);
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

  useEffect(() => {
    const loadRememberSession = async () => {
      const loadedState = await loadRememberSessionState();
      setRememberSession(loadedState);
    };
    loadRememberSession();
  }, []);

  const handleUnlock = useCallback(() => {
    const passwordValue = passwordRef.current?.value;
    if (passwordValue && signIn(passwordValue, rememberSession)) {
      saveRememberSessionState(rememberSession);
      navigateToPath();

      if (process.env.NODE_ENV === 'production') {
        chrome.runtime
          .sendMessage<EventLoginBackgroundMessage>({
            app: GEM_WALLET,
            type: 'EVENT_LOGIN',
            source: 'GEM_WALLET_MSG_REQUEST',
            payload: {
              id: 0,
              result: {
                loggedIn: true
              }
            }
          })
          .catch((e) => {
            Sentry.captureException(e);
          });
      }
    } else {
      setPasswordError('Incorrect password');
    }
  }, [signIn, rememberSession, navigateToPath]);

  // Handle Login step button by pressing 'Enter'
  useKeyUp('Enter', handleUnlock);

  const handleTextFieldChange = useCallback(() => {
    setPasswordError('');
  }, []);

  const handleReset = useCallback(() => {
    navigate(RESET_PASSWORD_PATH);
  }, [navigate]);

  const handleRememberSessionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setRememberSession(checked);
  };

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
        <Logo isAnimated style={{ transform: 'scale(2)' }} />
        <Typography variant="h4" component="h1" style={{ marginTop: '30px' }}>
          GemWallet
        </Typography>
        <Typography variant="h6" component="h2" style={{ marginTop: '30px' }}>
          Your gateway to the XRPL
        </Typography>
      </Container>
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '180px'
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
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberSession}
              onChange={handleRememberSessionChange}
              name="rememberSession"
              color="primary"
              style={{ transform: 'scale(0.9)' }}
            />
          }
          label={
            <Typography style={{ fontSize: '0.9rem' }}>Keep me logged in for 30 minutes</Typography>
          }
          style={{ marginTop: '5px' }}
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

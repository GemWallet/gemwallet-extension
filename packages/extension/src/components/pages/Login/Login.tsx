import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import * as Sentry from '@sentry/react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  PARAMETER_SUBMIT_TRANSACTIONS_BULK,
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
  SHARE_PUBLIC_KEY_PATH,
  SIGN_MESSAGE_PATH,
  SIGN_TRANSACTION_PATH,
  STORAGE_WALLETS,
  SUBMIT_TRANSACTIONS_BULK_PATH,
  SUBMIT_TRANSACTION_PATH,
  TRANSACTION_PATH,
  WELCOME_PATH
} from '../../../constants';
import { useWallet } from '../../../contexts';
import { useKeyUp } from '../../../hooks/useKeyUp';
import { loadData } from '../../../utils';
import { loadRememberSessionState, saveRememberSessionState } from '../../../utils/login';
import { Logo } from '../../atoms/Logo';

export const Login: FC = () => {
  const [passwordError, setPasswordError] = useState('');
  const [rememberSession, setRememberSession] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [disableLogin, setDisableLogin] = useState(false);
  const maxAttempts = 5;
  const [currentAttempts, setCurrentAttempts] = useState(0);
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

  useEffect(() => {
    const data = window.localStorage.getItem('loginDisabled');
    if (data !== null) {
      console.log('current date:' + Date.now());
      const expireDate = JSON.parse(data).expiresOn;
      console.log('expireDate' + expireDate);
      if (expireDate > Date.now()) {
        console.log('hello login disable');
        setDisableLogin(true);
      } else {
        console.log('hello login ok ');
        setDisableLogin(false);
      }
    }
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
      if (currentAttempts >= maxAttempts) {
        let TIMESTAMP = Date.now();
        setDisableLogin(true);
        window.localStorage.setItem(
          'loginDisabled',
          JSON.stringify({
            value: true,
            expiresOn: TIMESTAMP + 1000 * 60 * 15
          })
        );
        setPasswordError('Please try again in 15 min');
      } else {
        setCurrentAttempts((currentAttempts) => currentAttempts + 1);
        console.log(currentAttempts);
        setPasswordError('Incorrect password');
      }
    }
  }, [signIn, rememberSession, navigateToPath, currentAttempts]);

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
          disabled={disableLogin}
          inputRef={passwordRef}
          error={!!passwordError}
          onChange={handleTextFieldChange}
          helperText={passwordError}
          type={showPassword ? 'text' : 'password'}
          style={{ marginBottom: !passwordError ? '33px' : '10px' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
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
        <Button variant="contained" onClick={handleUnlock} disabled={disableLogin}>
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

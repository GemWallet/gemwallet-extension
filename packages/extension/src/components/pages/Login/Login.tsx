import { useState, useEffect, FC, useCallback, useRef } from 'react';

import { Button, Container, TextField, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { useNavigate, useLocation } from 'react-router-dom';

import { GEM_WALLET } from '@gemwallet/constants';

import {
  HOME_PATH,
  PARAMETER_ADDRESS,
  PARAMETER_SIGN_MESSAGE,
  PARAMETER_TRANSACTION_PAYMENT,
  RESET_PASSWORD_PATH,
  SIGN_MESSAGE_PATH,
  SHARE_PUBLIC_ADDRESS_PATH,
  STORAGE_WALLETS,
  TRANSACTION_PATH,
  WELCOME_PATH,
  PARAMETER_PUBLIC_KEY,
  SHARE_PUBLIC_KEY_PATH,
  ADD_NEW_TRUSTLINE_PATH,
  PARAMETER_TRANSACTION_TRUSTLINE,
  PARAMETER_NFT,
  SHARE_NFT_PATH
} from '../../../constants';
import { useBrowser, useWallet } from '../../../contexts';
import { useBeforeUnload } from '../../../hooks';
import { useKeyUp } from '../../../hooks/useKeyUp';
import { loadData } from '../../../utils';
import { Logo } from '../../atoms/Logo';

export const Login: FC = () => {
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { search } = useLocation();
  const { window: extensionWindow, closeExtension } = useBrowser();
  const { signIn, wallets, selectedWallet } = useWallet();
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleTransaction = useCallback(
    (payload: unknown) => {
      chrome.runtime
        .sendMessage(payload)
        .then(() => {
          if (extensionWindow?.id) {
            closeExtension({ windowId: Number(extensionWindow.id) });
          }
        })
        .catch((e) => {
          Sentry.captureException(e);
        });
    },
    [closeExtension, extensionWindow?.id]
  );

  useBeforeUnload(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const windowId = Number(urlParams.get('id'));
    if (extensionWindow?.id && windowId) {
      if (search.includes(PARAMETER_TRANSACTION_PAYMENT)) {
        const urlParams = new URLSearchParams(window.location.search);
        const type =
          urlParams.get('requestMessage') === 'RECEIVE_SEND_PAYMENT/V3'
            ? 'RECEIVE_SEND_PAYMENT/V3'
            : 'RECEIVE_PAYMENT_HASH';
        handleTransaction({
          app: GEM_WALLET,
          type,
          payload: {
            id: windowId,
            hash: null
          }
        });
      } else if (search.includes(PARAMETER_ADDRESS)) {
        handleTransaction({
          app: GEM_WALLET,
          type: 'RECEIVE_ADDRESS',
          payload: {
            id: windowId,
            publicAddress: null
          }
        });
      } else if (search.includes(PARAMETER_PUBLIC_KEY)) {
        handleTransaction({
          app: GEM_WALLET,
          type: 'RECEIVE_PUBLIC_KEY',
          payload: {
            id: windowId,
            address: null,
            publicKey: null
          }
        });
      } else if (search.includes(PARAMETER_SIGN_MESSAGE)) {
        handleTransaction({
          app: GEM_WALLET,
          type: 'RECEIVE_SIGN_MESSAGE',
          payload: {
            id: windowId,
            signedMessage: null
          }
        });
      } else if (search.includes(PARAMETER_TRANSACTION_TRUSTLINE)) {
        const urlParams = new URLSearchParams(window.location.search);
        const type =
          urlParams.get('requestMessage') === 'RECEIVE_SET_TRUSTLINE/V3'
            ? 'RECEIVE_SET_TRUSTLINE/V3'
            : 'RECEIVE_TRUSTLINE_HASH';
        handleTransaction({
          app: GEM_WALLET,
          type,
          payload: {
            id: windowId,
            hash: null
          }
        });
      } else if (search.includes(PARAMETER_NFT)) {
        const urlParams = new URLSearchParams(window.location.search);
        const type =
          urlParams.get('requestMessage') === 'REQUEST_GET_NFT/V3'
            ? 'RECEIVE_GET_NFT/V3'
            : 'RECEIVE_NFT';
        handleTransaction({
          app: GEM_WALLET,
          type,
          payload: {
            id: windowId,
            nfts: null
          }
        });
      }
    }
  });

  const navigateToPath = useCallback(() => {
    if (search.includes(PARAMETER_TRANSACTION_PAYMENT)) {
      navigate(`${TRANSACTION_PATH}${search}`);
    } else if (search.includes(PARAMETER_ADDRESS)) {
      navigate(`${SHARE_PUBLIC_ADDRESS_PATH}${search}`);
    } else if (search.includes(PARAMETER_PUBLIC_KEY)) {
      navigate(`${SHARE_PUBLIC_KEY_PATH}${search}`);
    } else if (search.includes(PARAMETER_SIGN_MESSAGE)) {
      navigate(`${SIGN_MESSAGE_PATH}${search}`);
    } else if (search.includes(PARAMETER_TRANSACTION_TRUSTLINE)) {
      navigate(`${ADD_NEW_TRUSTLINE_PATH}${search}`);
    } else if (search.includes(PARAMETER_NFT)) {
      navigate(`${SHARE_NFT_PATH}${search}`);
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

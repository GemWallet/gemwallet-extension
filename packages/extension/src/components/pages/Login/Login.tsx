import { useState, useEffect, FC, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Logo } from '../../atoms/Logo';
import { useLedger } from '../../../contexts';
import { loadData } from '../../../utils';
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
  SHARE_PUBLIC_KEY_PATH
} from '../../../constants';

export const Login: FC = () => {
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { search } = useLocation();
  const { signIn, wallets, selectedWallet } = useLedger();

  useEffect(() => {
    // Check if we are still logged-in
    if (wallets?.[selectedWallet]) {
      if (search.includes(PARAMETER_TRANSACTION_PAYMENT)) {
        navigate(`${TRANSACTION_PATH}${search}`);
      } else if (search.includes(PARAMETER_ADDRESS)) {
        navigate(`${SHARE_PUBLIC_ADDRESS_PATH}${search}`);
      } else if (search.includes(PARAMETER_PUBLIC_KEY)) {
        navigate(`${SHARE_PUBLIC_KEY_PATH}${search}`);
      } else if (search.includes(PARAMETER_SIGN_MESSAGE)) {
        navigate(`${SIGN_MESSAGE_PATH}${search}`);
      } else {
        navigate(`${HOME_PATH}${search}`);
      }
      // We check if a wallet is saved
    } else if (!loadData(STORAGE_WALLETS)) {
      navigate(`${WELCOME_PATH}${search}`);
    }
  }, [navigate, search, selectedWallet, wallets]);

  const handleUnlock = useCallback(() => {
    const isSignIn = signIn((document.getElementById('password') as HTMLInputElement).value);
    if (isSignIn) {
      if (search.includes(PARAMETER_TRANSACTION_PAYMENT)) {
        navigate(`${TRANSACTION_PATH}${search}`);
      } else if (search.includes(PARAMETER_ADDRESS)) {
        navigate(`${SHARE_PUBLIC_ADDRESS_PATH}${search}`);
      } else if (search.includes(PARAMETER_PUBLIC_KEY)) {
        navigate(`${SHARE_PUBLIC_KEY_PATH}${search}`);
      } else if (search.includes(PARAMETER_SIGN_MESSAGE)) {
        navigate(`${SIGN_MESSAGE_PATH}${search}`);
      } else {
        navigate(`${HOME_PATH}${search}`);
      }
    } else {
      setPasswordError('Incorrect password');
    }
  }, [signIn, search, navigate]);

  /*
   * Handle Login step button by pressing 'Enter'
   */
  useEffect(() => {
    const upHandler = ({ key }: { key: string }) => {
      if (key === 'Enter') {
        handleUnlock();
      }
    };
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keyup', upHandler);
    };
  }, [handleUnlock]);

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
        height: '100vh',
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
          id="password"
          name="password"
          label="Password"
          error={!!passwordError}
          onChange={handleTextFieldChange}
          helperText={passwordError}
          type="password"
          style={{ marginBottom: '20px' }}
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

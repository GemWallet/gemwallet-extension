import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Logo } from '../../atoms/Logo';
import { useLedger } from '../../../contexts/LedgerContext';
import { loadData } from '../../../utils';
import { STORAGE_SEED } from '../../../constants/localStorage';

export function Login() {
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { search } = useLocation();
  const { signIn, wallet } = useLedger();

  useEffect(() => {
    // Check if we are still logged-in
    if (wallet) {
      if (search.includes('transaction=payment')) {
        navigate(`/transaction${search}`);
      } else {
        navigate(`/home${search}`);
      }
      // We check if a wallet is saved
    } else if (!loadData(STORAGE_SEED)) {
      navigate(`/welcome${search}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnlock = () => {
    const isSignIn = signIn((document.getElementById('password') as HTMLInputElement).value);
    if (isSignIn) {
      if (search.includes('transaction=payment')) {
        navigate(`/transaction${search}`);
      } else {
        navigate(`/home${search}`);
      }
    } else {
      setPasswordError('Incorrect password');
    }
  };

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
          helperText={passwordError}
          type="password"
          style={{ marginBottom: '20px' }}
        />
        <Button variant="contained" onClick={handleUnlock}>
          Unlock
        </Button>
      </Container>
    </Container>
  );
}

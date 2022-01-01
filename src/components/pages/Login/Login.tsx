import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Logo } from '../../atoms/Logo';

export function Login() {
  const navigate = useNavigate();

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
      <Container style={{ display: 'flex', flexDirection: 'column' }}>
        <Button
          variant="contained"
          style={{ marginBottom: '10px' }}
          onClick={() => navigate('/create-new-wallet')}
        >
          Create a new wallet
        </Button>
        <Button variant="contained" color="secondary" onClick={() => {}}>
          Import a seed phrase
        </Button>
      </Container>
    </Container>
  );
}

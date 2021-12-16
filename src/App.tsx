import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ErrorIcon from '@mui/icons-material/Error';
import { Navbar } from './components/organisms/Navbar';

function App() {
  const [params, setParams] = useState({
    chain: '',
    transaction: '',
    amount: 0,
    destination: '',
    asset: ''
  });

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const chain = urlParams.get('chain') || '';
    const transaction = urlParams.get('transaction') || '';
    const amount = Number(urlParams.get('amount')) || 0;
    const destination = urlParams.get('destination') || '';
    let asset = urlParams.get('asset') || '';
    if (chain === 'xrp') {
      asset = 'XRP';
    }
    setParams({
      chain,
      transaction,
      amount,
      destination,
      asset
    });
  }, []);

  const { amount, destination, asset } = params;
  return (
    <>
      <Navbar />
      <Container
        component="main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 'calc(100vh - 94px - 40px)',
          margin: '20px auto'
        }}
      >
        <Typography variant="h4" component="h1" style={{ fontSize: '1.75rem' }} gutterBottom>
          Confirm Transaction
        </Typography>
        <Paper elevation={24} style={{ padding: '10px' }}>
          <Typography variant="body1">Destination:</Typography>
          <Typography variant="body2">{destination}</Typography>
        </Paper>
        <Paper elevation={24} style={{ padding: '10px' }}>
          <Typography variant="body1">Amount:</Typography>
          <Typography variant="h4" component="h1" gutterBottom align="right">
            {amount} {asset}
          </Typography>
        </Paper>
        <Paper elevation={24} style={{ padding: '10px' }}>
          <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="These are the fees to make the transaction over the network">
              <IconButton size="small">
                <ErrorIcon />
              </IconButton>
            </Tooltip>
            Network fees:
          </Typography>
          <Typography variant="body2" gutterBottom align="right">
            0.00000001 {asset}
          </Typography>
        </Paper>
        <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button variant="contained" color="secondary">
            Reject
          </Button>
          <Button variant="contained">Confirm</Button>
        </Container>
      </Container>
    </>
  );
}

export default App;

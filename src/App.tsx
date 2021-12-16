import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
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
      <Container component="main">
        <Typography variant="h2" component="h1" gutterBottom>
          Sticky footer
        </Typography>
        <Typography variant="body1" align="right">
          {destination}
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom align="right">
          {amount} {asset}
        </Typography>
        <Container>
          <Button variant="contained" color="secondary">
            Cancel
          </Button>
          <Button variant="contained">Approve</Button>
        </Container>
      </Container>
    </>
  );
}

export default App;

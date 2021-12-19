import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ErrorIcon from '@mui/icons-material/Error';
import { PageWithNavbar } from '../../templates/PageWithNavbar';
import { Transaction as TransactionOrganism } from '../../organisms/Transaction/Transaction';

export function Transaction() {
  const [params, setParams] = useState({
    chain: '',
    transaction: '',
    amount: 0,
    destination: '',
    asset: ''
  });

  /**
   * transaction can have 4 stages:
   * - waiting: waiting for a user interaction
   * - pending: transaction is pending to be a success or rejected (in progress)
   * - success: transaction has been successful
   * - rejected: transaction has been rejected
   */
  const [transaction, setTransaction] = useState('waiting');

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

  const handleConfirm = () => {
    setTransaction('pending');
  };

  const handleReject = () => {
    setTransaction('rejected');
  };

  const handleTransaction = (transactionState: string) => {
    setTransaction(transactionState);
  };

  if (transaction !== 'waiting') {
    return (
      <PageWithNavbar title="">
        <TransactionOrganism transaction={transaction} handleTransaction={handleTransaction} />
      </PageWithNavbar>
    );
  }

  const { amount, destination, asset } = params;
  return (
    <PageWithNavbar title="Confirm Transaction">
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
        <Button variant="contained" color="secondary" onClick={handleReject}>
          Reject
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          Confirm
        </Button>
      </Container>
    </PageWithNavbar>
  );
}

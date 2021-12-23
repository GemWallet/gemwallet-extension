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
import { useLedger } from '../../../contexts/LedgerContext';

const DEFAULT_FEES = 'Loading ...';

export function Transaction() {
  const [params, setParams] = useState({
    chain: '',
    transaction: '',
    amount: '0',
    fees: DEFAULT_FEES,
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
  const { client, estimateNetworkFees, sendTransaction } = useLedger();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const chain = urlParams.get('chain') || '';
    const transaction = urlParams.get('transaction') || '';
    const amount = urlParams.get('amount') || '0';
    const destination = urlParams.get('destination') || '';
    let asset = urlParams.get('asset') || '';
    if (chain === 'xrp') {
      asset = 'XRP';
    }
    setParams({
      chain,
      transaction,
      amount,
      fees: DEFAULT_FEES,
      destination,
      asset
    });
  }, []);

  useEffect(() => {
    if (client) {
      const { chain, transaction, amount, destination, asset } = params;
      estimateNetworkFees(amount).then((fees: string) => {
        setParams({
          chain,
          transaction,
          amount,
          fees: fees || DEFAULT_FEES,
          destination,
          asset
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const handleConfirm = () => {
    setTransaction('pending');
    const { amount, destination } = params;
    sendTransaction({ amount, destination })
      .then((result) => {
        setTransaction(result);
      })
      .catch(() => {
        setTransaction('rejected');
      });
  };

  const handleReject = () => {
    setTransaction('rejected');
  };

  if (transaction !== 'waiting') {
    return (
      <PageWithNavbar title="">
        <TransactionOrganism transaction={transaction} />
      </PageWithNavbar>
    );
  }

  const { amount, fees, destination, asset } = params;
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
          {fees === DEFAULT_FEES ? DEFAULT_FEES : `${fees} ${asset}`}
        </Typography>
      </Paper>
      <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button variant="contained" color="secondary" onClick={handleReject}>
          Reject
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={!client}>
          Confirm
        </Button>
      </Container>
    </PageWithNavbar>
  );
}

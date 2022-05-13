import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ErrorIcon from '@mui/icons-material/Error';
import { PageWithNavbar } from '../../templates';
import { Transaction as TransactionOrganism } from '../../organisms/Transaction';
import { useLedger } from '../../../contexts/LedgerContext';
import { GEM_WALLET, REQUEST_TRANSACTION_STATUS } from '@gemwallet/api/src/constants/message';
import { MessageListenerEvent } from '@gemwallet/api/src/constants/message.types';
import { TransactionStatus } from '@gemwallet/api/src/constants/transaction.types';
import { TileLoader } from '../../atoms';
import { formatToken } from '../../../utils';

const DEFAULT_FEES = 'Loading ...';

export function Transaction() {
  const [params, setParams] = useState({
    chain: '',
    transaction: '',
    amount: '0',
    fees: DEFAULT_FEES,
    destination: '',
    token: '',
    id: 0
  });

  /**
   * transaction can have 4 stages:
   * - waiting: waiting for a user interaction
   * - pending: transaction is pending to be a success or rejected (in progress)
   * - success: transaction has been successful
   * - rejected: transaction has been rejected
   */
  const [transaction, setTransaction] = useState<TransactionStatus>('waiting');
  const { client, estimateNetworkFees, sendTransaction } = useLedger();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const chain = urlParams.get('chain') || '';
    const transaction = (urlParams.get('transaction') as TransactionStatus) || 'waiting';
    const amount = urlParams.get('amount') || '0';
    const destination = urlParams.get('destination') || '';
    const id = Number(urlParams.get('id')) || 0;
    let token = urlParams.get('token') || '';
    if (chain === 'xrp' && token === '') {
      token = 'XRP';
    }
    setParams({
      chain,
      transaction,
      amount,
      fees: DEFAULT_FEES,
      destination,
      token,
      id
    });
  }, []);

  useEffect(() => {
    if (client) {
      const { amount } = params;
      estimateNetworkFees(amount).then((fees: string) => {
        setParams((prevParams) => ({
          ...prevParams,
          fees: fees || DEFAULT_FEES
        }));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const createMessage = (status: TransactionStatus): MessageListenerEvent => {
    const { id } = params;
    return {
      app: GEM_WALLET,
      type: REQUEST_TRANSACTION_STATUS,
      payload: {
        status,
        id
      }
    };
  };

  const handleConfirm = () => {
    setTransaction('pending');
    const { amount, destination } = params;
    sendTransaction({ amount, destination })
      .then((result) => {
        setTransaction(result);
        const message = createMessage(result);
        chrome.runtime.sendMessage(message);
      })
      .catch(() => {
        handleReject();
      });
  };

  const handleReject = () => {
    const status = 'rejected';
    setTransaction(status);
    const message = createMessage(status);
    chrome.runtime.sendMessage(message);
  };

  if (transaction !== 'waiting') {
    return (
      <PageWithNavbar title="">
        <TransactionOrganism transaction={transaction} />
      </PageWithNavbar>
    );
  }

  const { amount, fees, destination, token } = params;
  return (
    <PageWithNavbar title="Confirm Transaction">
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">Destination:</Typography>
        <Typography variant="body2">{destination}</Typography>
      </Paper>
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">Amount:</Typography>
        <Typography variant="h4" component="h1" gutterBottom align="right">
          {formatToken(Number(amount), token)}
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
          {fees === DEFAULT_FEES ? <TileLoader secondLineOnly /> : formatToken(Number(fees), token)}
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

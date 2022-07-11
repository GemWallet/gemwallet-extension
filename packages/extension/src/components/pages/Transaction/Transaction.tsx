import { FC, useCallback, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ErrorIcon from '@mui/icons-material/Error';
import { PageWithTitle } from '../../templates';
import { Transaction as TransactionOrganism } from '../../organisms/Transaction';
import { useLedger } from '../../../contexts/LedgerContext';
import { GEM_WALLET, RECEIVE_PAYMENT_HASH } from '@gemwallet/api/src/types/message';
import {
  MessageListenerEvent,
  PaymentResponseError,
  PaymentResponseHash,
  TransactionStatus
} from '@gemwallet/api';
import { TileLoader } from '../../atoms';
import { formatToken } from '../../../utils';

const DEFAULT_FEES = 'Loading ...';
const TOKEN = 'XRP';

export const Transaction: FC = () => {
  const [params, setParams] = useState({
    amount: '0',
    fees: DEFAULT_FEES,
    destination: '',
    id: 0
  });

  const { amount, fees, destination } = params;

  /**
   * transaction can have 4 stages:
   * - waiting: waiting for a user interaction
   * - pending: transaction is pending to be a success or rejected (in progress)
   * - success: transaction has been successful
   * - rejected: transaction has been rejected
   */
  const [transaction, setTransaction] = useState<TransactionStatus>('waiting');
  const { client, estimateNetworkFees, sendPayment } = useLedger();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const amount = urlParams.get('amount') || '0';
    const destination = urlParams.get('destination') || '';
    const id = Number(urlParams.get('id')) || 0;

    setParams({
      amount,
      fees: DEFAULT_FEES,
      destination,
      id
    });
  }, []);

  useEffect(() => {
    if (client) {
      const { amount } = params;
      estimateNetworkFees({ amount, destination }).then((fees: string) => {
        setParams((prevParams) => ({
          ...prevParams,
          fees
        }));
      });
    }
  }, [client, destination, estimateNetworkFees, params]);

  const createMessage = useCallback(
    (transactionHash: string | null): MessageListenerEvent => {
      const { id } = params;
      let transactionResponse: PaymentResponseError | PaymentResponseHash = {
        error: 'Transaction has been rejected'
      } as PaymentResponseError;
      if (transactionHash !== null) {
        transactionResponse = {
          hash: transactionHash
        } as PaymentResponseHash;
      }
      return {
        app: GEM_WALLET,
        type: RECEIVE_PAYMENT_HASH,
        payload: {
          id,
          ...transactionResponse
        }
      };
    },
    [params]
  );

  const handleReject = useCallback(() => {
    setTransaction('rejected');
    const message = createMessage(null);
    chrome.runtime.sendMessage(message);
  }, [createMessage]);

  const handleConfirm = useCallback(() => {
    setTransaction('pending');
    const { amount, destination } = params;
    sendPayment({ amount, destination })
      .then((transactionHash) => {
        setTransaction('success');
        const message = createMessage(transactionHash);
        chrome.runtime.sendMessage(message);
      })
      //TODO: Catch this error and handle it
      .catch(() => {
        handleReject();
      });
  }, [createMessage, handleReject, params, sendPayment]);

  if (transaction !== 'waiting') {
    return (
      <PageWithTitle title="">
        <TransactionOrganism transaction={transaction} />
      </PageWithTitle>
    );
  }

  return (
    <PageWithTitle title="Confirm Transaction">
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">Destination:</Typography>
        <Typography variant="body2">{destination}</Typography>
      </Paper>
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">Amount:</Typography>
        <Typography variant="h4" component="h1" gutterBottom align="right">
          {formatToken(Number(amount), TOKEN)}
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
          {fees === DEFAULT_FEES ? <TileLoader secondLineOnly /> : formatToken(Number(fees), TOKEN)}
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
    </PageWithTitle>
  );
};

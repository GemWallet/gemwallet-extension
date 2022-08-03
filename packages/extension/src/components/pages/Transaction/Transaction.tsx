import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ErrorIcon from '@mui/icons-material/Error';
import { PageWithSpinner, PageWithTitle } from '../../templates';
import { Transaction as TransactionOrganism } from '../../organisms/Transaction';
import { useLedger, useServer } from '../../../contexts';
import { GEM_WALLET, Message } from '@gemwallet/api/src';
import { MessageListenerEvent, PaymentResponseError, PaymentResponseHash } from '@gemwallet/api';
import { TransactionStatus } from '../../../types';
import { TileLoader } from '../../atoms';
import { formatToken } from '../../../utils';
import { ERROR_RED, Tokens } from '../../../constants';

const DEFAULT_FEES = 'Loading ...';

interface Params {
  amount: string | null;
  destination: string | null;
  id: number;
}

export const Transaction: FC = () => {
  const [params, setParams] = useState<Params>({
    amount: null,
    destination: null,
    id: 0
  });
  const [fees, setFees] = useState<string>(DEFAULT_FEES);
  const [errorFees, setErrorFees] = useState('');
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [difference, setDifference] = useState<number | undefined>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);

  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { client, estimateNetworkFees, sendPayment, getCurrentWallet } = useLedger();
  const { serverInfo } = useServer();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const amount = urlParams.get('amount');
    const destination = urlParams.get('destination');
    const id = Number(urlParams.get('id')) || 0;

    if (amount === null || destination === null) {
      setIsParamsMissing(true);
    }

    setParams({
      amount,
      destination,
      id
    });
  }, []);

  useEffect(() => {
    if (client && params.amount && params.destination) {
      estimateNetworkFees({ amount: params.amount, destination: params.destination })
        .then((fees) => {
          setFees(fees);
        })
        .catch((e) => {
          Sentry.captureException(e);
          setErrorFees(e.message);
        });
    }
  }, [client, estimateNetworkFees, params.amount, params.destination]);

  useEffect(() => {
    async function calculateDifference() {
      const currentWallet = getCurrentWallet();
      if (currentWallet && params.amount) {
        const currentBalance = await client?.getXrpBalance(currentWallet!.publicAddress);
        const difference =
          Number(currentBalance) -
          Number(serverInfo?.info.validated_ledger?.reserve_base_xrp) -
          Number(params.amount);
        setDifference(difference);
      }
    }
    calculateDifference();
  }, [
    params.amount,
    client,
    getCurrentWallet,
    serverInfo?.info.validated_ledger?.reserve_base_xrp
  ]);

  useEffect(() => {
    if (isParamsMissing) {
      Sentry.captureMessage('Params are missing');
    }
  }, [isParamsMissing]);

  const createMessage = useCallback(
    (transactionHash: string | null): MessageListenerEvent => {
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
        type: Message.ReceivePaymentHash,
        payload: {
          id: params.id,
          ...transactionResponse
        }
      };
    },
    [params.id]
  );

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage(null);
    chrome.runtime.sendMessage(message);
  }, [createMessage]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // Amount and Destination will be present because if not,
    // we won't be able to go to the confirm transaction state
    sendPayment({ amount: params.amount as string, destination: params.destination as string })
      .then((transactionHash) => {
        setTransaction(TransactionStatus.Success);
        const message = createMessage(transactionHash);
        chrome.runtime.sendMessage(message);
      })
      .catch((e) => {
        Sentry.captureException(e);
        setErrorRequestRejection(e.message);
        handleReject();
      });
  }, [createMessage, handleReject, params.amount, params.destination, sendPayment]);

  const hasEnoughFunds = useMemo(() => {
    return Number(difference) > 0;
  }, [difference]);

  if (isParamsMissing) {
    return (
      <PageWithTitle title="">
        <TransactionOrganism
          transaction={TransactionStatus.Rejected}
          failureReason="You need to provide an amount and a destination to make the transaction"
        />
      </PageWithTitle>
    );
  }

  if (!difference) {
    return <PageWithSpinner />;
  }

  if (transaction !== TransactionStatus.Waiting) {
    return (
      <PageWithTitle title="">
        <TransactionOrganism transaction={transaction} failureReason={errorRequestRejection} />
      </PageWithTitle>
    );
  }

  const { amount, destination } = params;

  return (
    <PageWithTitle title="Confirm Transaction">
      {!hasEnoughFunds ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ErrorIcon style={{ color: ERROR_RED }} />
          <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
            Insufficient funds.
          </Typography>
        </div>
      ) : null}
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">Destination:</Typography>
        <Typography variant="body2">{destination}</Typography>
      </Paper>
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">Amount:</Typography>
        <Typography variant="h4" component="h1" gutterBottom align="right">
          {formatToken(Number(amount), Tokens.XRP)}
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
          {errorFees ? (
            <Typography variant="caption" style={{ color: ERROR_RED }}>
              {errorFees}
            </Typography>
          ) : fees === DEFAULT_FEES ? (
            <TileLoader secondLineOnly />
          ) : (
            formatToken(Number(fees), Tokens.XRP)
          )}
        </Typography>
      </Paper>
      <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button variant="contained" color="secondary" onClick={handleReject}>
          Reject
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={!hasEnoughFunds}>
          Confirm
        </Button>
      </Container>
    </PageWithTitle>
  );
};

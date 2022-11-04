import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';

import { GEM_WALLET, Message, ReceivePaymentHashBackgroundMessage } from '@gemwallet/constants';

import { ERROR_RED, Tokens } from '../../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import { formatToken } from '../../../utils';
import { TileLoader } from '../../atoms';
import { AsyncTransaction, PageWithSpinner, PageWithTitle } from '../../templates';

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
  const [errorDifference, setErrorDifference] = useState<string | undefined>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);

  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { estimateNetworkFees, sendPayment } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { client, network } = useNetwork();
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
    const currentWallet = getCurrentWallet();
    if (currentWallet && params.amount) {
      client
        ?.getXrpBalance(currentWallet!.publicAddress)
        .then((currentBalance) => {
          const difference =
            Number(currentBalance) -
            Number(serverInfo?.info.validated_ledger?.reserve_base_xrp) -
            Number(params.amount);
          setDifference(difference);
        })
        .catch((e) => {
          setErrorDifference(e.message);
        });
    }
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
    (transactionHash: string | null | undefined): ReceivePaymentHashBackgroundMessage => {
      return {
        app: GEM_WALLET,
        type: Message.ReceivePaymentHash,
        payload: {
          id: params.id,
          hash: transactionHash
        }
      };
    },
    [params.id]
  );

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage(null);
    chrome.runtime.sendMessage<ReceivePaymentHashBackgroundMessage>(message);
  }, [createMessage]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // Amount and Destination will be present because if not,
    // we won't be able to go to the confirm transaction state
    sendPayment({ amount: params.amount as string, destination: params.destination as string })
      .then((transactionHash) => {
        setTransaction(TransactionStatus.Success);
        const message = createMessage(transactionHash);
        chrome.runtime.sendMessage<ReceivePaymentHashBackgroundMessage>(message);
      })
      .catch((e) => {
        Sentry.captureException(e);
        setErrorRequestRejection(e.message);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage(undefined);
        chrome.runtime.sendMessage<ReceivePaymentHashBackgroundMessage>(message);
      });
  }, [createMessage, params.amount, params.destination, sendPayment]);

  const hasEnoughFunds = useMemo(() => {
    return Number(difference) > 0;
  }, [difference]);

  if (isParamsMissing) {
    return (
      <AsyncTransaction
        title="Transaction rejected"
        subtitle={
          <>
            Your transaction failed, please try again.
            <br />
            An amount and a destination have not been provided to the extension.
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (errorDifference) {
    if (errorDifference === 'Account not found.') {
      return (
        <AsyncTransaction
          title="Account not activated"
          subtitle={
            <>
              {`Your account is not activated on the ${network} network.`}
              <br />
              {'Switch network or activate your account.'}
            </>
          }
          transaction={TransactionStatus.Rejected}
        />
      );
    }
    Sentry.captureException('Transaction failed - errorDifference: ' + errorDifference);
    return (
      <AsyncTransaction
        title="Error"
        subtitle={errorDifference}
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (!difference) {
    return <PageWithSpinner />;
  }

  if (transaction === TransactionStatus.Success) {
    return (
      <AsyncTransaction
        title="Transaction accepted"
        subtitle={
          <>
            We are processing your transaction
            <br />
            Please wait
          </>
        }
        transaction={TransactionStatus.Success}
      />
    );
  }

  if (transaction === TransactionStatus.Rejected) {
    return (
      <AsyncTransaction
        title="Transaction rejected"
        subtitle={
          <>
            Your transaction failed, please try again.
            <br />
            {errorRequestRejection ? errorRequestRejection : 'Something went wrong'}
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (transaction === TransactionStatus.Pending) {
    return (
      <AsyncTransaction
        title="Transaction in progress"
        subtitle={
          <>
            We are processing your transaction
            <br />
            Please wait
          </>
        }
        transaction={TransactionStatus.Pending}
      />
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

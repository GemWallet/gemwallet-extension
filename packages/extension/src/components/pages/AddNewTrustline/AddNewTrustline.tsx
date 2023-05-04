import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { Button, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { isValidAddress } from 'xrpl';

import { GEM_WALLET, ReceiveTrustlineHashBackgroundMessage } from '@gemwallet/constants';

import { DEFAULT_RESERVE, ERROR_RED } from '../../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import { formatAmount, formatToken } from '../../../utils';
import { TileLoader } from '../../atoms';
import { AsyncTransaction, PageWithSpinner, PageWithTitle } from '../../templates';

const DEFAULT_FEES = 'Loading ...';

type STEP = 'WARNING' | 'TRANSACTION';

interface Params {
  fee: string | null;
  value: string | null;
  currency: string | null;
  issuer: string | null;
  id: number;
}

export const AddNewTrustline: FC = () => {
  const [step, setStep] = useState<STEP>('WARNING');
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [params, setParams] = useState<Params>({
    fee: null,
    value: null,
    currency: null,
    issuer: null,
    id: 0
  });
  const [fees, setFees] = useState<string>(DEFAULT_FEES);
  const [errorFees, setErrorFees] = useState('');
  const [difference, setDifference] = useState<number | undefined>();
  const [errorDifference, setErrorDifference] = useState<string>('');
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [errorValue, setErrorValue] = useState<string>('');
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);

  const { estimateNetworkFees, addTrustline } = useLedger();
  const { client, network } = useNetwork();
  const { getCurrentWallet } = useWallet();
  const { serverInfo } = useServer();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const fee = urlParams.get('fee');
    const value = urlParams.get('value');
    const currency = urlParams.get('currency');
    const issuer = urlParams.get('issuer');
    const id = Number(urlParams.get('id')) || 0;

    if (value === null || currency === null || issuer === null) {
      setIsParamsMissing(true);
    }

    if (Number.isNaN(Number(value))) {
      setErrorValue('The value must be a number, the value provided was not a number.');
    }

    setParams({
      fee,
      value,
      currency,
      issuer,
      id
    });
  }, []);

  useEffect(() => {
    const wallet = getCurrentWallet();

    if (wallet && params.value && params.currency && params.issuer) {
      estimateNetworkFees({
        TransactionType: 'TrustSet',
        Account: wallet.publicAddress,
        Fee: params.fee || undefined,
        LimitAmount: {
          value: params.value,
          currency: params.currency,
          issuer: params.issuer
        }
      })
        .then((fees) => {
          setFees(fees);
        })
        .catch((e) => {
          Sentry.captureException(e);
          setErrorFees(e.message);
        });
    }
  }, [
    estimateNetworkFees,
    getCurrentWallet,
    params.currency,
    params.fee,
    params.issuer,
    params.value
  ]);

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && params.value) {
      client
        ?.getXrpBalance(currentWallet!.publicAddress)
        .then((currentBalance) => {
          const difference =
            Number(currentBalance) -
            Number(serverInfo?.info.validated_ledger?.reserve_base_xrp || DEFAULT_RESERVE) -
            Number(params.fee || 0);
          setDifference(difference);
        })
        .catch((e) => {
          setErrorDifference(e.message);
        });
    }
  }, [
    client,
    getCurrentWallet,
    serverInfo?.info.validated_ledger?.reserve_base_xrp,
    params.fee,
    params.value
  ]);

  const isValidIssuer = useMemo(() => {
    if (params.issuer && isValidAddress(params.issuer)) {
      return true;
    }
    return false;
  }, [params.issuer]);

  const hasEnoughFunds = useMemo(() => Number(difference) > 0, [difference]);

  const createMessage = useCallback(
    (transactionHash: string | null | undefined): ReceiveTrustlineHashBackgroundMessage => {
      return {
        app: GEM_WALLET,
        type: 'RECEIVE_TRUSTLINE_HASH',
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
    chrome.runtime.sendMessage<ReceiveTrustlineHashBackgroundMessage>(message);
  }, [createMessage]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // Value, currency and issuer will be present because if not,
    // we won't be able to go to the confirm transaction state
    if (params.value === null || params.currency === null || params.issuer === null) {
      setIsParamsMissing(true);
    } else {
      addTrustline({
        currency: params.currency,
        issuer: params.issuer,
        fee: params.fee || undefined,
        value: params.value
      })
        .then((transactionHash) => {
          setTransaction(TransactionStatus.Success);
          const message = createMessage(transactionHash);
          chrome.runtime.sendMessage<ReceiveTrustlineHashBackgroundMessage>(message);
        })
        .catch((e) => {
          setErrorRequestRejection(e.message);
          setTransaction(TransactionStatus.Rejected);
          const message = createMessage(undefined);
          chrome.runtime.sendMessage<ReceiveTrustlineHashBackgroundMessage>(message);
        });
    }
  }, [addTrustline, createMessage, params.currency, params.fee, params.issuer, params.value]);

  if (isParamsMissing) {
    return (
      <AsyncTransaction
        title="Transaction rejected"
        subtitle={
          <>
            Your transaction failed, please try again.
            <br />A value, currency and issuer need to be provided to the extension.
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (!isValidIssuer) {
    return (
      <AsyncTransaction
        title="Incorrect transaction"
        subtitle={
          <>
            Your transaction is incorrect.
            <br />
            The issuer of the trustline is invalid.
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (errorValue) {
    return (
      <AsyncTransaction
        title="Incorrect transaction"
        subtitle={
          <>
            {errorValue}
            <br />
            {'Please try again with a correct transaction'}
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

  if (transaction === TransactionStatus.Success || transaction === TransactionStatus.Pending) {
    return (
      <AsyncTransaction
        title={
          transaction === TransactionStatus.Success
            ? 'Transaction accepted'
            : 'Transaction in progress'
        }
        subtitle={
          transaction === TransactionStatus.Success ? (
            'Transaction Successful'
          ) : (
            <>
              We are processing your transaction
              <br />
              Please wait
            </>
          )
        }
        transaction={transaction}
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

  if (step === 'WARNING') {
    return (
      <PageWithTitle title="Add Trustline">
        <div
          style={{
            height: '100%',
            paddingTop: '50px'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <WarningIcon color="warning" fontSize="large" />
            <Typography color="#ffac33">Warning</Typography>
          </div>
          <Typography align="center" style={{ marginTop: '2rem' }}>
            GemWallet does not recommend or support any particular token or issuer.
          </Typography>
          <Typography align="center" variant="body2" style={{ marginTop: '1rem' }}>
            It is important to add only the tokens and issuers you trust.
          </Typography>
          <Typography align="center" variant="body2" style={{ marginTop: '1rem' }}>
            Continue at your own risk
          </Typography>
        </div>
        <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button variant="contained" color="secondary" onClick={handleReject}>
            Reject
          </Button>
          <Button variant="contained" onClick={() => setStep('TRANSACTION')} disabled={false}>
            Continue
          </Button>
        </Container>
      </PageWithTitle>
    );
  }

  const { issuer, currency, value } = params;

  return (
    <PageWithTitle title="Add Trustline - Confirm">
      {!hasEnoughFunds ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Tooltip title="You need more funds on your wallet to proceed">
            <IconButton size="small">
              <ErrorIcon style={{ color: ERROR_RED }} />
            </IconButton>
          </Tooltip>
          <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
            Insufficient funds.
          </Typography>
        </div>
      ) : null}
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">Issuer:</Typography>
        <Typography variant="body2">{issuer}</Typography>
      </Paper>
      <Paper
        elevation={24}
        style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography variant="body1">Currency:</Typography>
        <Typography variant="body1">{currency}</Typography>
      </Paper>

      <Paper
        elevation={24}
        style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography variant="body1">Limit:</Typography>
        <Typography variant="body1">{formatToken(Number(value), currency || undefined)}</Typography>
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
            formatAmount(fees)
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

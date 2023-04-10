import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { useTranslation } from 'react-i18next';
import { isValidAddress, xrpToDrops } from 'xrpl';

import { GEM_WALLET, ReceivePaymentHashBackgroundMessage } from '@gemwallet/constants';

import { DEFAULT_RESERVE, ERROR_RED } from '../../../constants';
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
  currency: string | null;
  issuer: string | null;
}

export const Transaction: FC = () => {
  const [params, setParams] = useState<Params>({
    amount: null,
    destination: null,
    id: 0,
    currency: null,
    issuer: null
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
  const { t } = useTranslation('common');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const amount = urlParams.get('amount');
    const destination = urlParams.get('destination');
    const id = Number(urlParams.get('id')) || 0;
    const currency = urlParams.get('currency');
    const issuer = urlParams.get('issuer');

    if (amount === null || destination === null) {
      setIsParamsMissing(true);
    }

    setParams({
      amount,
      destination,
      id,
      currency,
      issuer
    });
  }, []);

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && client && params.amount && params.destination) {
      estimateNetworkFees({
        TransactionType: 'Payment',
        Account: currentWallet.publicAddress,
        Amount:
          params.currency && params.issuer
            ? {
                currency: params.currency,
                issuer: params.issuer,
                value: params.amount
              }
            : xrpToDrops(params.amount),
        Destination: params.destination
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
    client,
    estimateNetworkFees,
    getCurrentWallet,
    params.amount,
    params.currency,
    params.destination,
    params.issuer
  ]);

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && params.amount) {
      client
        ?.getXrpBalance(currentWallet!.publicAddress)
        .then((currentBalance) => {
          const difference =
            Number(currentBalance) -
            Number(serverInfo?.info.validated_ledger?.reserve_base_xrp || DEFAULT_RESERVE) -
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

  const isValidDestination = useMemo(() => {
    if (params.destination && isValidAddress(params.destination)) {
      return true;
    }
    return false;
  }, [params.destination]);

  const createMessage = useCallback(
    (transactionHash: string | null | undefined): ReceivePaymentHashBackgroundMessage => {
      return {
        app: GEM_WALLET,
        type: 'RECEIVE_PAYMENT_HASH',
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
    sendPayment({
      amount: params.amount as string,
      destination: params.destination as string,
      currency: params.currency ?? undefined,
      issuer: params.issuer ?? undefined
    })
      .then((transactionHash) => {
        setTransaction(TransactionStatus.Success);
        const message = createMessage(transactionHash);
        chrome.runtime.sendMessage<ReceivePaymentHashBackgroundMessage>(message);
      })
      .catch((e) => {
        setErrorRequestRejection(e.message);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage(undefined);
        chrome.runtime.sendMessage<ReceivePaymentHashBackgroundMessage>(message);
      });
  }, [
    createMessage,
    params.amount,
    params.currency,
    params.destination,
    params.issuer,
    sendPayment
  ]);

  const hasEnoughFunds = useMemo(() => {
    return Number(difference) > 0;
  }, [difference]);

  if (isParamsMissing) {
    return (
      <AsyncTransaction
        title={t('TEXT_TRANSACTION_REJECTED')}
        subtitle={
          <>
            {t('TEXT_TRANSACTION_FAILED')}
            <br />
            {t('TEXT_TRANSACTION_FAILED_DETAILS_1')}
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (!isValidDestination) {
    return (
      <AsyncTransaction
        title={t('TEXT_INCORRECT_TRANSACTION')}
        subtitle={
          <>
            {t('TEXT_INCORRECT_TRANSACTION_DETAILS_1')}
            <br />
            {t('TEXT_INCORRECT_TRANSACTION_DETAILS_2')}
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
          title={t('TEXT_ACCOUNT_NOT_ACTIVATED')}
          subtitle={
            <>
              {t('TEXT_ACCOUNT_NOT_ACTIVATED_ON_NETWORK', { network: network })}
              <br />
              {t('TEXT_PLEASE_SWITCH_NETWORK')}
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
            ? t('TEXT_TRANSACTION_ACCEPTED')
            : t('TEXT_TRANSACTION_IN_PROGRESS')
        }
        subtitle={
          transaction === TransactionStatus.Success ? (
            t('TEXT_TRANSACTION_SUCCESSFUL')
          ) : (
            <>
              {t('TEXT_TRANSACTION_PROCESSING')}
              <br />
              {t('TEXT_PLEASE_WAIT')}
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
        title={t('TEXT_TRANSACTION_REJECTED')}
        subtitle={
          <>
            {t('TEXT_TRANSACTION_FAILED')}
            <br />
            {errorRequestRejection ? errorRequestRejection : t('TEXT_SOMETHING_WENT_WRONG')}
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  const { amount, destination, currency } = params;

  return (
    <PageWithTitle title={t('TEXT_CONFIRM_TRANSACTION')}>
      {!hasEnoughFunds ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ErrorIcon style={{ color: ERROR_RED }} />
          <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
            {t('TEXT_INSUFFICIENT_FUNDS')}
          </Typography>
        </div>
      ) : null}
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">{t('TEXT_DESTINATION')}:</Typography>
        <Typography variant="body2">{destination}</Typography>
      </Paper>
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">{t('TEXT_AMOUNT')}:</Typography>
        <Typography variant="h4" component="h1" gutterBottom align="right">
          {formatToken(Number(amount), currency || 'XRP')}
        </Typography>
      </Paper>
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={t('TEXT_FEES_EXPLANATION')}>
            <IconButton size="small">
              <ErrorIcon />
            </IconButton>
          </Tooltip>
          {t('TEXT_NETWORK_FEES')}:
        </Typography>
        <Typography variant="body2" gutterBottom align="right">
          {errorFees ? (
            <Typography variant="caption" style={{ color: ERROR_RED }}>
              {errorFees}
            </Typography>
          ) : fees === DEFAULT_FEES ? (
            <TileLoader secondLineOnly />
          ) : (
            formatToken(Number(fees), 'XRP')
          )}
        </Typography>
      </Paper>
      <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button variant="contained" color="secondary" onClick={handleReject}>
          {t('TEXT_REJECT')}
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={!hasEnoughFunds}>
          {t('TEXT_CONFIRM')}
        </Button>
      </Container>
    </PageWithTitle>
  );
};

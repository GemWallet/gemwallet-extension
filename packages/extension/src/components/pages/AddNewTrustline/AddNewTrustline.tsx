import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { Button, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { useTranslation } from 'react-i18next';
import { isValidAddress } from 'xrpl';

import { GEM_WALLET, ReceiveTrustlineHashBackgroundMessage } from '@gemwallet/constants';

import { DEFAULT_RESERVE, ERROR_RED } from '../../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import { formatToken } from '../../../utils';
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
  const { t } = useTranslation('common');

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
        title={t('TEXT_TRANSACTION_REJECTED')}
        subtitle={
          <>
            {t('TEXT_TRANSACTION_FAILED')}
            <br />{t('TEXT_TRANSACTION_FAILED_DETAILS_2')}
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (!isValidIssuer) {
    return (
      <AsyncTransaction
        title={t('TEXT_INCORRECT_TRANSACTION')}
        subtitle={
          <>
            {t('TEXT_INCORRECT_TRANSACTION_DETAILS_1')}
            <br />
            {t('TEXT_INVALID_TRUSTLINE_ISSUER')}
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (errorValue) {
    return (
      <AsyncTransaction
        title={t('TEXT_INCORRECT_TRANSACTION')}
        subtitle={
          <>
            {errorValue}
            <br />
            {t('TEXT_TRY_AGAIN_WITH_CORRECT_TRANSACTION')}
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
            {errorRequestRejection ? errorRequestRejection : 'Something went wrong'}
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (step === 'WARNING') {
    return (
      <PageWithTitle title={t('TEXT_ADD_TRUSTLINE')}>
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
            {t('TEXT_DISPLAIMER_TOKEN_1')}
          </Typography>
          <Typography align="center" variant="body2" style={{ marginTop: '1rem' }}>
            {t('TEXT_DISCLAIMER_TOKEN_2')}
          </Typography>
          <Typography align="center" variant="body2" style={{ marginTop: '1rem' }}>
            {t('TEXT_DISCLAIMER_TOKEN_3')}
          </Typography>
        </div>
        <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button variant="contained" color="secondary" onClick={handleReject}>
            {t('TEXT_REJECT')}
          </Button>
          <Button variant="contained" onClick={() => setStep('TRANSACTION')} disabled={false}>
            {t('TEXT_CONFIRM')}
          </Button>
        </Container>
      </PageWithTitle>
    );
  }

  const { issuer, currency, value, fee } = params;

  return (
    <PageWithTitle title={t('TEXT_ADD_TRUSTLINE_CONFIRM')}>
      {!hasEnoughFunds ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Tooltip title={t('TEXT_NEED_MORE_FUNDS')}>
            <IconButton size="small">
              <ErrorIcon style={{ color: ERROR_RED }} />
            </IconButton>
          </Tooltip>
          <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
            {t('TEXT_INSUFFICIENT_FUNDS')}
          </Typography>
        </div>
      ) : null}
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">{t('TEXT_ISSUER')}:</Typography>
        <Typography variant="body2">{issuer}</Typography>
      </Paper>
      <Paper
        elevation={24}
        style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography variant="body1">{t('TEXT_CURRENCY')}:</Typography>
        <Typography variant="body1">{currency}</Typography>
      </Paper>

      <Paper
        elevation={24}
        style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography variant="body1">{t('TEXT_LIMIT')}:</Typography>
        <Typography variant="body1">{formatToken(Number(value), currency || undefined)}</Typography>
      </Paper>
      <Paper
        elevation={24}
        style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography variant="body1">{t('TEXT_FEES')}:</Typography>
        <Typography variant="body1">{formatToken(Number(fee))}</Typography>
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

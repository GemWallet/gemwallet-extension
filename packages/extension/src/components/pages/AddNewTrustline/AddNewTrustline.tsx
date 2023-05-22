import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { Button, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { isValidAddress } from 'xrpl';
import { IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common';

import {
  GEM_WALLET,
  Memo,
  TrustSetFlags,
  ReceiveSetTrustlineBackgroundMessage,
  ReceiveSetTrustlineBackgroundMessageDeprecated
} from '@gemwallet/constants';

import { DEFAULT_RESERVE, ERROR_RED } from '../../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import {
  checkFee,
  formatAmount,
  formatFlags,
  formatToken,
  fromHexMemos,
  parseLimitAmount,
  parseMemos,
  parseTrustSetFlags,
  toXRPLMemos
} from '../../../utils';
import { TileLoader } from '../../atoms';
import { AsyncTransaction, PageWithSpinner, PageWithTitle } from '../../templates';

const DEFAULT_FEES = 'Loading ...';

type STEP = 'WARNING' | 'TRANSACTION';

interface Params {
  limitAmount: IssuedCurrencyAmount | null;
  fee: string | null;
  id: number;
  memos: Memo[] | null;
  flags: TrustSetFlags | null;
}

export const AddNewTrustline: FC = () => {
  const [step, setStep] = useState<STEP>('WARNING');
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [params, setParams] = useState<Params>({
    limitAmount: null,
    fee: null,
    id: 0,
    memos: null,
    flags: null
  });
  const [estimatedFees, setEstimatedFees] = useState<string>(DEFAULT_FEES);
  const [errorFees, setErrorFees] = useState('');
  const [difference, setDifference] = useState<number | undefined>();
  const [errorDifference, setErrorDifference] = useState<string>('');
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [errorValue, setErrorValue] = useState<string>('');
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);

  const { estimateNetworkFees, setTrustline } = useLedger();
  const { client, network } = useNetwork();
  const { getCurrentWallet } = useWallet();
  const { serverInfo } = useServer();

  const receivingMessage = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    return urlParams.get('requestMessage') === 'REQUEST_SET_TRUSTLINE/V3'
      ? 'RECEIVE_SET_TRUSTLINE/V3'
      : 'RECEIVE_TRUSTLINE_HASH';
  }, []);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const limitAmount = parseLimitAmount(
      urlParams.get('limitAmount'),
      urlParams.get('value'),
      urlParams.get('currency'),
      urlParams.get('issuer')
    );
    const fee = checkFee(urlParams.get('fee'));
    const id = Number(urlParams.get('id')) || 0;
    const memos = parseMemos(urlParams.get('memos'));
    const flags = parseTrustSetFlags(urlParams.get('flags'));

    if (limitAmount === null) {
      setIsParamsMissing(true);
    }

    if (Number.isNaN(Number(limitAmount?.value))) {
      setErrorValue('The value must be a number, the value provided was not a number.');
    }

    setParams({
      limitAmount,
      fee,
      id,
      memos,
      flags
    });
  }, []);

  useEffect(() => {
    const wallet = getCurrentWallet();

    if (wallet && params.limitAmount) {
      estimateNetworkFees({
        TransactionType: 'TrustSet',
        Account: wallet.publicAddress,
        Fee: params.fee || undefined,
        LimitAmount: params.limitAmount,
        Memos: params.memos ? toXRPLMemos(params.memos) : undefined,
        Flags: params.flags ?? undefined
      })
        .then((fees) => {
          setEstimatedFees(fees);
        })
        .catch((e) => {
          Sentry.captureException(e);
          setErrorFees(e.message);
        });
    }
  }, [
    estimateNetworkFees,
    getCurrentWallet,
    params.limitAmount,
    params.fee,
    params.memos,
    params.flags
  ]);

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && params.limitAmount) {
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
    params.limitAmount
  ]);

  const isValidIssuer = useMemo(() => {
    if (params.limitAmount && isValidAddress(params.limitAmount?.issuer)) {
      return true;
    }
    return false;
  }, [params.limitAmount]);

  const hasEnoughFunds = useMemo(() => Number(difference) > 0, [difference]);

  const createMessage = useCallback(
    (
      transactionHash: string | null | undefined
    ): ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated => {
      if (receivingMessage === 'RECEIVE_SET_TRUSTLINE/V3') {
        return {
          app: GEM_WALLET,
          type: 'RECEIVE_SET_TRUSTLINE/V3',
          payload: {
            id: params.id,
            result: transactionHash ? { hash: transactionHash } : null
          }
        };
      }

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_TRUSTLINE_HASH',
        payload: {
          id: params.id,
          hash: transactionHash
        }
      };
    },
    [params.id, receivingMessage]
  );

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage(null);
    chrome.runtime.sendMessage<
      ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated
    >(message);
  }, [createMessage]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // Value, currency and issuer will be present because if not,
    // we won't be able to go to the confirm transaction state
    if (params.limitAmount === null) {
      setIsParamsMissing(true);
    } else {
      setTrustline({
        limitAmount: params.limitAmount,
        fee: params.fee || undefined,
        memos: params.memos || undefined,
        flags: params.flags || undefined
      })
        .then((transactionHash) => {
          setTransaction(TransactionStatus.Success);
          const message = createMessage(transactionHash);
          chrome.runtime.sendMessage<
            ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated
          >(message);
        })
        .catch((e) => {
          setErrorRequestRejection(e.message);
          setTransaction(TransactionStatus.Rejected);
          const message = createMessage(undefined);
          chrome.runtime.sendMessage<
            ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated
          >(message);
        });
    }
  }, [setTrustline, createMessage, params.limitAmount, params.fee, params.flags, params.memos]);

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

  const { fee, flags, memos } = params;
  const decodedMemos = fromHexMemos(memos || []) || [];

  const limitAmount = params.limitAmount as IssuedCurrencyAmount;

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
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography variant="body1">Issuer:</Typography>
        <Typography variant="body2">{limitAmount.issuer}</Typography>
      </Paper>
      <Paper
        elevation={24}
        style={{
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '5px'
        }}
      >
        <Typography variant="body1">Currency:</Typography>
        <Typography variant="body1">{limitAmount.currency}</Typography>
      </Paper>

      <Paper
        elevation={24}
        style={{
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '5px'
        }}
      >
        <Typography variant="body1">Limit:</Typography>
        <Typography variant="body1">{formatAmount(limitAmount)}</Typography>
      </Paper>
      {decodedMemos.length > 0 ? (
        <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
          <Typography variant="body1">Memos:</Typography>
          {decodedMemos.map((memo, index) => (
            <div
              key={index}
              style={{
                marginBottom: index === decodedMemos.length - 1 ? 0 : '8px'
              }}
            >
              <Typography
                variant="body2"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}
              >
                {memo.memo.memoData}
              </Typography>
            </div>
          ))}
        </Paper>
      ) : null}
      {flags ? (
        <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
          <Typography variant="body1">Flags:</Typography>
          <Typography variant="body2">
            <pre style={{ margin: 0 }}>{formatFlags(flags)}</pre>
          </Typography>
        </Paper>
      ) : null}
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
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
          ) : estimatedFees === DEFAULT_FEES ? (
            <TileLoader secondLineOnly />
          ) : fee ? (
            formatToken(Number(fee), 'XRP (manual)', true)
          ) : (
            formatAmount(estimatedFees)
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

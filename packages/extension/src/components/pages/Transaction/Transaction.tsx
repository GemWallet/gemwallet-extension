import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { dropsToXrp, isValidAddress } from 'xrpl';
import { Amount } from 'xrpl/dist/npm/models/common';

import {
  GEM_WALLET,
  Memo,
  PaymentFlags,
  ReceiveSendPaymentBackgroundMessage,
  ReceiveSendPaymentBackgroundMessageDeprecated,
  ResponseType
} from '@gemwallet/constants';

import {
  API_ERROR_BAD_DESTINATION,
  API_ERROR_BAD_REQUEST,
  DEFAULT_RESERVE,
  ERROR_RED
} from '../../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import {
  checkFee,
  formatAmount,
  formatFlags,
  formatToken,
  fromHexMemos,
  parseAmount,
  parseMemos,
  parsePaymentFlags,
  toXRPLMemos
} from '../../../utils';
import { serializeError, toUIError } from '../../../utils/errors';
import { TileLoader } from '../../atoms';
import { AsyncTransaction, PageWithSpinner, PageWithTitle } from '../../templates';

const DEFAULT_FEES = 'Loading ...';

interface Params {
  amount: Amount | null;
  destination: string | null;
  id: number;
  memos: Memo[] | null;
  destinationTag: number | null;
  fee: string | null;
  flags: PaymentFlags | null;
}

export const Transaction: FC = () => {
  const [params, setParams] = useState<Params>({
    amount: null,
    destination: null,
    id: 0,
    memos: null,
    destinationTag: null,
    fee: null,
    flags: null
  });
  const [estimatedFees, setEstimatedFees] = useState<string>(DEFAULT_FEES);
  const [errorFees, setErrorFees] = useState('');
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [difference, setDifference] = useState<number | undefined>();
  const [errorDifference, setErrorDifference] = useState<Error | undefined>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);

  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { estimateNetworkFees, sendPayment } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { client, network } = useNetwork();
  const { serverInfo } = useServer();

  const { messageType, receivingMessage } = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('requestMessage') === 'REQUEST_SEND_PAYMENT/V3'
      ? { messageType: 'REQUEST_SEND_PAYMENT/V3', receivingMessage: 'RECEIVE_SEND_PAYMENT/V3' }
      : { messageType: 'SEND_PAYMENT', receivingMessage: 'RECEIVE_PAYMENT_HASH' };
  }, []);

  const createMessage = useCallback(
    (payload: {
      transactionHash: string | null | undefined;
      error?: Error;
    }): ReceiveSendPaymentBackgroundMessage | ReceiveSendPaymentBackgroundMessageDeprecated => {
      const { transactionHash, error } = payload;
      if (receivingMessage === 'RECEIVE_SEND_PAYMENT/V3') {
        return {
          app: GEM_WALLET,
          type: 'RECEIVE_SEND_PAYMENT/V3',
          payload: {
            id: params.id,
            type: ResponseType.Response,
            result: transactionHash ? { hash: transactionHash } : undefined,
            error: error ? serializeError(error) : undefined
          }
        };
      }

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_PAYMENT_HASH',
        payload: {
          id: params.id,
          hash: transactionHash
        }
      };
    },
    [params.id, receivingMessage]
  );

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const amount = parseAmount(
      urlParams.get('amount'),
      urlParams.get('currency'),
      urlParams.get('issuer'),
      messageType
    );
    const destination = urlParams.get('destination');
    const id = Number(urlParams.get('id')) || 0;
    const memos = parseMemos(urlParams.get('memos'));
    const destinationTag = urlParams.get('destinationTag')
      ? Number(urlParams.get('destinationTag'))
      : null;
    const fee = checkFee(urlParams.get('fee'));
    const flags = parsePaymentFlags(urlParams.get('flags'));

    if (amount === null || destination === null) {
      setIsParamsMissing(true);
    }

    setParams({
      amount,
      destination,
      id,
      memos,
      destinationTag,
      fee,
      flags
    });
  }, [messageType]);

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && client && params.amount && params.destination) {
      estimateNetworkFees({
        TransactionType: 'Payment',
        Account: currentWallet.publicAddress,
        Amount: params.amount,
        Destination: params.destination,
        Memos: params.memos ? toXRPLMemos(params.memos) : undefined,
        DestinationTag: params.destinationTag ?? undefined,
        Flags: params.flags ?? undefined
      })
        .then((fees) => {
          setEstimatedFees(fees);
        })
        .catch((e) => {
          chrome.runtime.sendMessage<
            ReceiveSendPaymentBackgroundMessage | ReceiveSendPaymentBackgroundMessageDeprecated
          >(createMessage({ transactionHash: null, error: e }));
          Sentry.captureException(e);
          setErrorFees(e.message);
        });
    }
  }, [
    client,
    estimateNetworkFees,
    getCurrentWallet,
    params.amount,
    params.destination,
    params.memos,
    params.destinationTag,
    params.fee,
    params.flags,
    createMessage
  ]);

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && params.amount) {
      const amount =
        typeof params.amount === 'string' ? dropsToXrp(params.amount) : params.amount.value;
      client
        ?.getXrpBalance(currentWallet!.publicAddress)
        .then((currentBalance) => {
          const difference =
            Number(currentBalance) -
            Number(serverInfo?.info.validated_ledger?.reserve_base_xrp || DEFAULT_RESERVE) -
            Number(amount);
          setDifference(difference);
        })
        .catch((e) => {
          setErrorDifference(e);
        });
    }
  }, [
    params.amount,
    client,
    getCurrentWallet,
    serverInfo?.info.validated_ledger?.reserve_base_xrp,
    createMessage
  ]);

  const isValidDestination = useMemo(() => {
    if (params.destination && isValidAddress(params.destination)) {
      return true;
    }
    return false;
  }, [params.destination]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    chrome.runtime.sendMessage<
      ReceiveSendPaymentBackgroundMessage | ReceiveSendPaymentBackgroundMessageDeprecated
    >(createMessage({ transactionHash: null }));
  }, [createMessage]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // Amount and Destination will be present because if not,
    // we won't be able to go to the confirm transaction state
    sendPayment({
      amount: params.amount as Amount,
      destination: params.destination as string,
      memos: params.memos ?? undefined,
      destinationTag: params.destinationTag ?? undefined,
      fee: params.fee ?? undefined,
      flags: params.flags ?? undefined
    })
      .then((transactionHash) => {
        setTransaction(TransactionStatus.Success);
        chrome.runtime.sendMessage<
          ReceiveSendPaymentBackgroundMessage | ReceiveSendPaymentBackgroundMessageDeprecated
        >(createMessage({ transactionHash }));
      })
      .catch((e) => {
        setErrorRequestRejection(toUIError(e).message);
        setTransaction(TransactionStatus.Rejected);
        chrome.runtime.sendMessage<
          ReceiveSendPaymentBackgroundMessage | ReceiveSendPaymentBackgroundMessageDeprecated
        >(createMessage({ transactionHash: undefined, error: e }));
      });
  }, [
    createMessage,
    params.amount,
    params.destination,
    params.memos,
    params.destinationTag,
    params.fee,
    params.flags,
    sendPayment
  ]);

  const hasEnoughFunds = useMemo(() => {
    return Number(difference) > 0;
  }, [difference]);

  if (isParamsMissing) {
    chrome.runtime.sendMessage<
      ReceiveSendPaymentBackgroundMessage | ReceiveSendPaymentBackgroundMessageDeprecated
    >(createMessage({ transactionHash: null, error: new Error(API_ERROR_BAD_REQUEST) }));
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

  if (!isValidDestination) {
    chrome.runtime.sendMessage<
      ReceiveSendPaymentBackgroundMessage | ReceiveSendPaymentBackgroundMessageDeprecated
    >(createMessage({ transactionHash: undefined, error: new Error(API_ERROR_BAD_DESTINATION) }));
    return (
      <AsyncTransaction
        title="Incorrect transaction"
        subtitle={
          <>
            Your transaction is incorrect.
            <br />
            The destination address of the transaction is invalid.
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (errorDifference) {
    chrome.runtime.sendMessage<
      ReceiveSendPaymentBackgroundMessage | ReceiveSendPaymentBackgroundMessageDeprecated
    >(createMessage({ transactionHash: null, error: errorDifference }));
    if (errorDifference.message === 'Account not found.') {
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
    Sentry.captureException('Transaction failed - errorDifference: ' + errorDifference.message);
    return (
      <AsyncTransaction
        title="Error"
        subtitle={errorDifference.message}
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

  const { amount, destination, memos, destinationTag, fee, flags } = params;
  const decodedMemos = fromHexMemos(memos || []);

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
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography variant="body1">Destination:</Typography>
        <Typography variant="body2">{destination}</Typography>
      </Paper>
      {decodedMemos && decodedMemos.length > 0 ? (
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
      {destinationTag ? (
        <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
          <Typography variant="body1">Destination Tag:</Typography>
          <Typography variant="body2">{destinationTag}</Typography>
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
        <Typography variant="body1">Amount:</Typography>
        <Typography variant="h6" component="h1" align="right">
          {amount ? formatAmount(amount) : 'Not found'}
        </Typography>
      </Paper>
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

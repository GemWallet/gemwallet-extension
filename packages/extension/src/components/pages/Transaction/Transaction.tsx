import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, Paper, Typography } from '@mui/material';
import { isValidAddress } from 'xrpl';
import { Amount } from 'xrpl/dist/npm/models/common';

import {
  GEM_WALLET,
  PaymentFlags,
  ReceiveSendPaymentBackgroundMessage,
  ReceiveSendPaymentBackgroundMessageDeprecated,
  ResponseType
} from '@gemwallet/constants';

import { API_ERROR_BAD_DESTINATION, API_ERROR_BAD_REQUEST, ERROR_RED } from '../../../constants';
import {
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress
} from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import {
  formatAmount,
  fromHexMemos,
  handleAmountHexCurrency,
  parseAmount,
  parsePaymentFlags,
  toXRPLMemos
} from '../../../utils';
import {
  BaseTransactionParams,
  initialBaseTransactionParams,
  parseBaseParamsFromURLParams
} from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { BaseTransaction } from '../../organisms/BaseTransaction/BaseTransaction';
import { AsyncTransaction, PageWithTitle } from '../../templates';

interface Params extends BaseTransactionParams {
  id: number;
  // SendPayment fields
  amount: Amount | null;
  destination: string | null;
  destinationTag: number | null;
  flags: PaymentFlags | null;
}

export const Transaction: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    // BaseTransaction fields
    ...initialBaseTransactionParams,
    // SendPayment fields
    amount: null,
    destination: null,
    destinationTag: null,
    flags: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { sendPayment } = useLedger();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'Payment',
      Account: '',
      Amount: params.amount ?? '',
      Destination: params.destination ?? '',
      Memos: params.memos ? toXRPLMemos(params.memos) : undefined,
      DestinationTag: params.destinationTag ?? undefined,
      Flags: params.flags ?? undefined
    },
    params.fee
  );

  const { messageType, receivingMessage } = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('requestMessage') === 'REQUEST_SEND_PAYMENT/V3'
      ? { messageType: 'REQUEST_SEND_PAYMENT/V3', receivingMessage: 'RECEIVE_SEND_PAYMENT/V3' }
      : { messageType: 'SEND_PAYMENT', receivingMessage: 'RECEIVE_PAYMENT_HASH' };
  }, []);

  const sendMessageToBackground = useCallback(
    (
      message: ReceiveSendPaymentBackgroundMessage | ReceiveSendPaymentBackgroundMessageDeprecated
    ) => {
      chrome.runtime.sendMessage(message);
      setTransactionProgress(TransactionProgressStatus.IDLE);
    },
    [setTransactionProgress]
  );

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

  const badRequestCallback = useCallback(() => {
    sendMessageToBackground(
      createMessage({
        transactionHash: null,
        error: new Error(API_ERROR_BAD_REQUEST)
      })
    );
  }, [createMessage, sendMessageToBackground]);

  const { hasEnoughFunds, transactionStatusComponent } = useTransactionStatus({
    isParamsMissing,
    errorFees,
    network: networkName,
    difference,
    transaction,
    errorRequestRejection,
    badRequestCallback
  });

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = Number(urlParams.get('id')) || 0;

    // BaseTransaction fields
    const {
      fee,
      sequence,
      accountTxnID,
      lastLedgerSequence,
      memos,
      signers,
      sourceTag,
      signingPubKey,
      ticketSequence,
      txnSignature
    } = parseBaseParamsFromURLParams(urlParams);

    // SendPayment fields
    const amount = parseAmount(
      urlParams.get('amount'),
      urlParams.get('currency'),
      urlParams.get('issuer'),
      messageType
    );
    const destination = urlParams.get('destination');
    const destinationTag = urlParams.get('destinationTag')
      ? Number(urlParams.get('destinationTag'))
      : null;
    const flags = parsePaymentFlags(urlParams.get('flags'));

    if (amount === null || destination === null) {
      setIsParamsMissing(true);
    }

    setParams({
      id,
      // BaseTransaction fields
      fee,
      sequence,
      accountTxnID,
      lastLedgerSequence,
      memos,
      signers,
      sourceTag,
      signingPubKey,
      ticketSequence,
      txnSignature,
      // SendPayment fields
      amount,
      destination,
      destinationTag,
      flags
    });
  }, [messageType, setTransactionProgress]);

  const isValidDestination = useMemo(() => {
    if (params.destination && isValidAddress(params.destination)) {
      return true;
    }
    return false;
  }, [params.destination]);

  useEffect(() => {
    // We want to send a bad request error message only when we have parsed the destination from the params
    if (params.destination && !isValidDestination) {
      sendMessageToBackground(
        createMessage({
          transactionHash: undefined,
          error: new Error(API_ERROR_BAD_DESTINATION)
        })
      );
    }
  }, [
    createMessage,
    isValidDestination,
    params.destination,
    sendMessageToBackground,
    setTransactionProgress
  ]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    sendMessageToBackground(createMessage({ transactionHash: null }));
  }, [createMessage, sendMessageToBackground]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // Amount and Destination will be present because if not,
    // we won't be able to go to the confirm transaction state
    handleAmountHexCurrency(params.amount as Amount);
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
        sendMessageToBackground(createMessage({ transactionHash }));
      })
      .catch((e) => {
        setErrorRequestRejection(e);
        setTransaction(TransactionStatus.Rejected);
        sendMessageToBackground(createMessage({ transactionHash: undefined, error: e }));
      });
  }, [
    params.amount,
    params.destination,
    params.memos,
    params.destinationTag,
    params.fee,
    params.flags,
    sendPayment,
    sendMessageToBackground,
    createMessage
  ]);

  if (!isValidDestination) {
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

  const {
    // BaseTransaction fields
    fee,
    memos,
    // SendPayment fields
    amount,
    destination,
    destinationTag,
    flags
  } = params;

  const decodedMemos = fromHexMemos(memos || []) || [];

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <PageWithTitle title="Confirm Payment">
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
          {destinationTag ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Destination Tag:</Typography>
              <Typography variant="body2">{destinationTag}</Typography>
            </Paper>
          ) : null}
          <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
            <Typography variant="body1">Amount:</Typography>
            <Typography variant="h6" component="h1" align="right">
              {amount ? formatAmount(amount) : 'Not found'}
            </Typography>
          </Paper>
          <div style={{ marginBottom: '40px' }}>
            <BaseTransaction
              fee={fee ? Number(fee) : null}
              memos={decodedMemos}
              flags={flags}
              errorFees={errorFees}
              estimatedFees={estimatedFees}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#1d1d1d'
            }}
          >
            <Container style={{ display: 'flex', justifyContent: 'space-evenly', margin: '10px' }}>
              <Button variant="contained" color="secondary" onClick={handleReject}>
                Reject
              </Button>
              <Button variant="contained" onClick={handleConfirm} disabled={!hasEnoughFunds}>
                Confirm
              </Button>
            </Container>
          </div>
        </PageWithTitle>
      )}
    </>
  );
};

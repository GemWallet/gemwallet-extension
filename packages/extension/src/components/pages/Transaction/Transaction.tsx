import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { isValidAddress, Payment } from 'xrpl';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveSendPaymentBackgroundMessage,
  ReceiveSendPaymentBackgroundMessageDeprecated,
  ResponseType
} from '@gemwallet/constants';

import { API_ERROR_BAD_DESTINATION } from '../../../constants';
import {
  buildPayment,
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress,
  useWallet
} from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseAmount, parsePaymentFlags } from '../../../utils';
import { parseBaseParamsFromURLParamsNew } from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { TransactionDetails } from '../../organisms';
import { AsyncTransaction, TransactionPage } from '../../templates';

interface Params {
  id: number;
  transaction: Payment | null;
}

export const Transaction: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    transaction: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { sendPayment } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'Payment',
      Account: '',
      Amount: params.transaction?.Amount ?? '',
      Destination: params.transaction?.Destination ?? '',
      Memos: params.transaction?.Memos ?? undefined,
      DestinationTag: params.transaction?.DestinationTag ?? undefined,
      Flags: params.transaction?.Flags ?? undefined
    },
    params.transaction?.Fee
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
    const wallet = getCurrentWallet();

    if (amount === null || destination === null) {
      setIsParamsMissing(true);
    }

    if (!wallet) {
      setIsParamsMissing(true);
      return;
    }

    const transaction = buildPayment(
      {
        ...parseBaseParamsFromURLParamsNew(urlParams),
        amount: amount ?? '0',
        destination: destination ?? '',
        ...(destinationTag && { destinationTag }),
        ...(flags && { flags })
      },
      wallet
    );

    setParams({
      id,
      transaction
    });
  }, [getCurrentWallet, messageType]);

  const isValidDestination = useMemo(() => {
    if (params.transaction?.Destination && isValidAddress(params.transaction.Destination)) {
      return true;
    }
    return false;
  }, [params.transaction?.Destination]);

  useEffect(() => {
    // We want to send a bad request error message only when we have parsed the destination from the params
    if (params.transaction?.Destination && !isValidDestination) {
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
    params.transaction?.Destination,
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
    sendPayment(params.transaction as Payment)
      .then((transactionHash) => {
        setTransaction(TransactionStatus.Success);
        sendMessageToBackground(createMessage({ transactionHash }));
      })
      .catch((e) => {
        setErrorRequestRejection(e);
        setTransaction(TransactionStatus.Rejected);
        sendMessageToBackground(createMessage({ transactionHash: undefined, error: e }));
      });
  }, [sendPayment, params.transaction, sendMessageToBackground, createMessage]);

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

  if (transactionStatusComponent) {
    return <div>{transactionStatusComponent}</div>;
  }

  return (
    <TransactionPage
      title="Send Payment"
      description="Please review the transaction below."
      approveButtonText="Submit"
      hasEnoughFunds={hasEnoughFunds}
      onClickApprove={handleConfirm}
      onClickReject={handleReject}
    >
      <TransactionDetails
        txParam={params.transaction}
        estimatedFees={estimatedFees}
        errorFees={errorFees}
        displayTransactionType={false}
      />
    </TransactionPage>
  );
};

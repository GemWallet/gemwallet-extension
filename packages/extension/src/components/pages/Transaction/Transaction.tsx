import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { isValidAddress, Payment } from 'xrpl';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveSendPaymentBackgroundMessage,
  ReceiveSendPaymentBackgroundMessageDeprecated,
  ResponseType,
  SendPaymentRequest,
  SendPaymentRequestDeprecated
} from '@gemwallet/constants';

import { API_ERROR_BAD_DESTINATION, STORAGE_MESSAGING_KEY } from '../../../constants';
import {
  buildPayment,
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress,
  useWallet
} from '../../../contexts';
import { useFees, useFetchFromSessionStorage, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseAmount, parsePaymentFlags, parsePaymentPaths } from '../../../utils';
import { parseBaseParamsFromStoredData } from '../../../utils/baseParams';
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
    params.transaction ?? [],
    params.transaction?.Fee
  );

  const urlParams = new URLSearchParams(window.location.search);
  const { fetchedData } = useFetchFromSessionStorage(
    urlParams.get(STORAGE_MESSAGING_KEY) ?? undefined
  ) as {
    fetchedData: SendPaymentRequest | SendPaymentRequestDeprecated | undefined;
  };

  const { messageType, receivingMessage } = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
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
    const urlParams = new URLSearchParams(window.location.search);
    const id = Number(urlParams.get('id')) || 0;
    const wallet = getCurrentWallet();

    if (!wallet) {
      setIsParamsMissing(true);
      return;
    }

    if (!fetchedData) {
      return;
    }

    const rawAmount = 'amount' in fetchedData ? fetchedData.amount : undefined;
    const currency = 'currency' in fetchedData ? fetchedData.currency : undefined;
    const issuer = 'issuer' in fetchedData ? fetchedData.issuer : undefined;

    const amount = parseAmount(rawAmount ?? null, currency ?? null, issuer ?? null, messageType);
    const destination = 'destination' in fetchedData ? fetchedData.destination : undefined;
    const destinationTag =
      'destinationTag' in fetchedData ? Number(fetchedData.destinationTag) : undefined;
    const invoiceID = 'invoiceID' in fetchedData ? fetchedData.invoiceID : undefined;
    const paths = 'paths' in fetchedData ? parsePaymentPaths(fetchedData.paths) : undefined;
    const sendMax =
      'sendMax' in fetchedData
        ? parseAmount(fetchedData.sendMax, null, null, messageType)
        : undefined;
    const deliverMin =
      'deliverMin' in fetchedData
        ? parseAmount(fetchedData.deliverMin, null, null, messageType)
        : undefined;
    const flags = 'flags' in fetchedData ? parsePaymentFlags(fetchedData.flags) : undefined;

    if (amount === null || destination === null) {
      setIsParamsMissing(true);
    }

    const transaction = buildPayment(
      {
        ...parseBaseParamsFromStoredData(fetchedData),
        amount: amount ?? '0',
        destination: destination ?? '',
        ...(destinationTag && { destinationTag }),
        ...(invoiceID && { invoiceID }),
        ...(paths && { paths }),
        ...(sendMax && { sendMax }),
        ...(deliverMin && { deliverMin }),
        ...(flags && { flags })
      },
      wallet
    );

    setParams({
      id,
      transaction
    });
  }, [fetchedData, getCurrentWallet, messageType]);

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

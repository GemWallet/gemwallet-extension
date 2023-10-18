import { FC, useCallback, useEffect, useState } from 'react';

import { Transaction } from 'xrpl';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveSignTransactionBackgroundMessage,
  ResponseType,
  SignTransactionRequest
} from '@gemwallet/constants';

import { STORAGE_MESSAGING_KEY } from '../../../constants';
import {
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress
} from '../../../contexts';
import { useFees, useFetchFromSessionStorage, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { serializeError } from '../../../utils/errors';
import { parseTransactionParam } from '../../../utils/parseParams';
import { TransactionDetails } from '../../organisms';
import { TransactionPage } from '../../templates';

interface Params {
  id: number;
  // SignTransaction fields
  txParam: Transaction | null;
}

export const SignTransaction: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    // SignTransaction fields
    txParam: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { signTransaction } = useLedger();
  const { isConnectionFailed, networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    params.txParam ?? {
      TransactionType: 'Payment',
      Account: '',
      Destination: '',
      Amount: ''
    },
    params.txParam?.Fee ?? null
  );

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const { fetchedData } = useFetchFromSessionStorage(
    urlParams.get(STORAGE_MESSAGING_KEY) ?? undefined
  ) as {
    fetchedData: SignTransactionRequest | undefined;
  };

  const sendMessageToBackground = useCallback(
    (message: ReceiveSignTransactionBackgroundMessage) => {
      chrome.runtime.sendMessage(message);
      setTransactionProgress(TransactionProgressStatus.IDLE);
    },
    [setTransactionProgress]
  );

  const createMessage = useCallback(
    (messagePayload: {
      signature: string | null | undefined;
      error?: Error;
    }): ReceiveSignTransactionBackgroundMessage => {
      const { signature, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_SIGN_TRANSACTION/V3',
        payload: {
          id: params.id,
          type: ResponseType.Response,
          result: signature
            ? {
                signature: signature
              }
            : undefined,
          error: error ? serializeError(error) : undefined
        }
      };
    },
    [params.id]
  );

  const badRequestCallback = useCallback(() => {
    sendMessageToBackground(
      createMessage({
        signature: null,
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

    if (!fetchedData) {
      return;
    }

    const transaction =
      'transaction' in fetchedData ? parseTransactionParam(fetchedData.transaction) : null;

    if (!transaction) {
      setIsParamsMissing(true);
    }

    setParams({
      id,
      txParam: transaction
    });
  }, [fetchedData]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage({
      signature: null
    });
    sendMessageToBackground(message);
  }, [createMessage, sendMessageToBackground]);

  const handleSign = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // txParam will be present because if not,
    // we won't be able to go to the confirm transaction state
    signTransaction({
      // SignTransaction fields
      transaction: params.txParam as Transaction
    })
      .then((response) => {
        setTransaction(TransactionStatus.Success);
        sendMessageToBackground(createMessage(response));
      })
      .catch((e) => {
        setErrorRequestRejection(e);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage({
          signature: undefined,
          error: e
        });
        sendMessageToBackground(message);
      });
  }, [signTransaction, params.txParam, sendMessageToBackground, createMessage]);

  const { txParam } = params;

  return (
    <>
      <style>{`
        .react-json-view .string-value {
          white-space: pre-wrap; /* allow text to break onto the next line */
          word-break: break-all; /* break long strings */
        }
      `}</style>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <TransactionPage
          title="Sign Transaction"
          description="You are about to sign a transaction, which means that you will grant permission to the third party that initiated this transaction, to submit it to the XRP Ledger on your behalf later."
          actionButtonsDescription="Only sign transactions with a website you trust."
          hasEnoughFunds={hasEnoughFunds}
          onClickApprove={handleSign}
          onClickReject={handleReject}
        >
          <TransactionDetails
            txParam={txParam}
            estimatedFees={estimatedFees}
            errorFees={errorFees}
            isConnectionFailed={isConnectionFailed}
          />
        </TransactionPage>
      )}
    </>
  );
};

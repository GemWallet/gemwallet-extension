import { FC, useCallback, useEffect, useState } from 'react';

import { Transaction } from 'xrpl';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveSubmitTransactionBackgroundMessage,
  ResponseType,
  SubmitTransactionRequest
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
  // SubmitTransaction fields
  txParam: Transaction | null;
}

export const SubmitTransaction: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    // SubmitTransaction fields
    txParam: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { submitTransaction } = useLedger();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, minimumFees, errorFees, difference } = useFees(
    params.txParam ?? [],
    params.txParam?.Fee
  );

  const urlParams = new URLSearchParams(window.location.search);
  const { fetchedData } = useFetchFromSessionStorage(
    urlParams.get(STORAGE_MESSAGING_KEY) ?? undefined
  ) as {
    fetchedData: SubmitTransactionRequest | undefined;
  };

  const sendMessageToBackground = useCallback(
    (message: ReceiveSubmitTransactionBackgroundMessage) => {
      chrome.runtime.sendMessage(message);
      setTransactionProgress(TransactionProgressStatus.IDLE);
    },
    [setTransactionProgress]
  );

  const createMessage = useCallback(
    (messagePayload: {
      hash: string | null | undefined;
      error?: Error;
    }): ReceiveSubmitTransactionBackgroundMessage => {
      const { hash, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_SUBMIT_TRANSACTION/V3',
        payload: {
          id: params.id,
          type: ResponseType.Response,
          result: hash
            ? {
                hash: hash
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
        hash: null,
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
      hash: null
    });
    sendMessageToBackground(message);
  }, [createMessage, sendMessageToBackground]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // txParam will be present because if not,
    // we won't be able to go to the confirm transaction state
    submitTransaction({
      // SubmitTransaction fields
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
          hash: undefined,
          error: e
        });
        sendMessageToBackground(message);
      });
  }, [submitTransaction, params.txParam, sendMessageToBackground, createMessage]);

  const handleFeeChange = useCallback(
    (fee: number) => {
      if (params.txParam) {
        setParams({
          ...params,
          txParam: {
            ...params.txParam,
            Fee: fee.toString()
          }
        });
      }
    },
    [params]
  );

  const { txParam } = params;

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <TransactionPage
          title="Submit Transaction"
          description="Please review the transaction below."
          approveButtonText="Submit"
          hasEnoughFunds={hasEnoughFunds}
          onClickApprove={handleConfirm}
          onClickReject={handleReject}
        >
          <TransactionDetails
            txParam={txParam}
            estimatedFees={estimatedFees}
            minimumFees={minimumFees}
            errorFees={errorFees}
            onFeeChange={handleFeeChange}
          />
        </TransactionPage>
      )}
    </>
  );
};

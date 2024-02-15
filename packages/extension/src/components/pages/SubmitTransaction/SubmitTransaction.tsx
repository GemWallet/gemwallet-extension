import { FC, useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { SubmittableTransaction } from 'xrpl';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveSubmitTransactionBackgroundMessage,
  ResponseType,
  SubmitTransactionRequest
} from '@gemwallet/constants';

import { SETTINGS_PATH, STORAGE_MESSAGING_KEY } from '../../../constants';
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
  txParam: SubmittableTransaction | null;
  // UI specific fields
  inAppCall: boolean;
}

export const SubmitTransaction: FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const inAppCall = urlParams.get('inAppCall') === 'true' || false;
  const [params, setParams] = useState<Params>({
    id: 0,
    // SubmitTransaction fields
    txParam: null,
    // UI specific fields
    inAppCall
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { submitTransaction } = useLedger();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    params.txParam ?? [],
    params.txParam?.Fee
  );

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

  const navigate = useNavigate();

  const { hasEnoughFunds, transactionStatusComponent } = useTransactionStatus({
    isParamsMissing,
    errorFees,
    network: networkName,
    difference,
    transaction,
    errorRequestRejection,
    badRequestCallback,
    onClick: params.inAppCall ? () => navigate(SETTINGS_PATH) : undefined
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
      txParam: transaction,
      // UI specific fields
      inAppCall
    });
  }, [fetchedData, inAppCall]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    if (!params.inAppCall) {
      const message = createMessage({
        hash: null
      });
      sendMessageToBackground(message);
    }
  }, [createMessage, params.inAppCall, sendMessageToBackground]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // txParam will be present because if not,
    // we won't be able to go to the confirm transaction state
    submitTransaction({
      // SubmitTransaction fields
      transaction: params.txParam as SubmittableTransaction
    })
      .then((response) => {
        setTransaction(TransactionStatus.Success);
        if (!params.inAppCall) {
          sendMessageToBackground(createMessage(response));
        }
      })
      .catch((e) => {
        setErrorRequestRejection(e);
        setTransaction(TransactionStatus.Rejected);
        if (!params.inAppCall) {
          const message = createMessage({
            hash: undefined,
            error: e
          });
          sendMessageToBackground(message);
        }
      });
  }, [submitTransaction, params.txParam, params.inAppCall, sendMessageToBackground, createMessage]);

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
            errorFees={errorFees}
          />
        </TransactionPage>
      )}
    </>
  );
};

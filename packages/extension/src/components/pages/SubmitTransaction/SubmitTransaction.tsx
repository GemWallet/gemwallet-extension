import { FC, useCallback, useEffect, useState } from 'react';

import { Transaction } from 'xrpl';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveSubmitTransactionBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import {
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress
} from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseTransactionParam } from '../../../utils';
import { serializeError } from '../../../utils/errors';
import { DataCard } from '../../molecules';
import { RawTransaction } from '../../molecules/RawTransaction';
import { Fee } from '../../organisms';
import DisplayXRPLTransaction from '../../organisms/DisplayXRPLTransaction/DisplayXRPLTransaction';
import { LoadingOverlay, TransactionPage } from '../../templates';

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
  const [isTxExpanded, setIsTxExpanded] = useState(false);
  const [isRawTxExpanded, setIsRawTxExpanded] = useState(false);
  const [isFeeExpanded, setIsFeeExpanded] = useState(false);
  const { submitTransaction } = useLedger();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    params.txParam ?? [],
    params.txParam?.Fee ?? null
  );

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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = Number(urlParams.get('id')) || 0;
    const txParam = parseTransactionParam(urlParams.get('transaction'));

    if (!txParam) {
      setIsParamsMissing(true);
    }

    setParams({
      id,
      txParam
    });
  }, []);

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

  const { txParam } = params;

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <>
          <TransactionPage
            title="Submit Transaction"
            description="Please review the transaction below."
            approveButtonText="Submit"
            hasEnoughFunds={hasEnoughFunds}
            onClickApprove={handleConfirm}
            onClickReject={handleReject}
          >
            {txParam?.Account ? (
              <>
                <DataCard
                  formattedData={<DisplayXRPLTransaction tx={txParam} useLegacy={false} />}
                  dataName={'Transaction details'}
                  isExpanded={isTxExpanded}
                  setIsExpanded={setIsTxExpanded}
                  paddingTop={10}
                />
                <DataCard
                  formattedData={<RawTransaction transaction={txParam} fontSize={12} />}
                  dataName={'Raw transaction'}
                  isExpanded={isRawTxExpanded}
                  setIsExpanded={setIsRawTxExpanded}
                  thresholdHeight={50}
                  paddingTop={10}
                />
                <DataCard
                  formattedData={
                    <Fee
                      errorFees={errorFees}
                      estimatedFees={estimatedFees}
                      fee={txParam?.Fee ? Number(txParam?.Fee) : null}
                      useLegacy={false}
                    />
                  }
                  isExpanded={isFeeExpanded}
                  setIsExpanded={setIsFeeExpanded}
                  paddingTop={10}
                />
              </>
            ) : (
              <LoadingOverlay />
            )}
          </TransactionPage>
        </>
      )}
    </>
  );
};

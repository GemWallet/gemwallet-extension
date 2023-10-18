import React, { FC, useCallback, useEffect, useState } from 'react';

import {
  API_ERROR_BAD_REQUEST,
  DEFAULT_SUBMIT_TX_BULK_ON_ERROR,
  GEM_WALLET,
  ReceiveSubmitBulkTransactionsBackgroundMessage,
  ResponseType,
  SubmitBulkTransactionsWithKeysRequest,
  TransactionBulkResponse,
  TransactionErrorHandling,
  TransactionWithID
} from '@gemwallet/constants';

import { STORAGE_MESSAGING_KEY, STORAGE_PERMISSION_SUBMIT_BULK } from '../../../constants';
import {
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress
} from '../../../contexts';
import { useFees, useFetchFromSessionStorage, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { loadFromChromeLocalStorage, saveInChromeLocalStorage } from '../../../utils';
import { serializeError } from '../../../utils/errors';
import { PermissionRequiredView } from './PermissionRequiredView';
import { RecapView } from './RecapView';
import { StepperView } from './StepperView';

interface Params {
  id: number;
  // submitBulkTransactions fields
  transactionsMapParam: Record<number, TransactionWithID> | null;
}

export const SubmitBulkTransactions: FC = () => {
  const MAX_TRANSACTIONS_PER_STEP = 20; // For the stepper
  const CHUNK_SIZE = 5; // For the submitBulkTransactions calls and the progress bar

  const [params, setParams] = useState<Params>({
    id: 0,
    transactionsMapParam: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const [showRecap, setShowRecap] = useState(true);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [onError, setOnError] = useState<TransactionErrorHandling>(DEFAULT_SUBMIT_TX_BULK_ON_ERROR);
  const [waitForHashes, setWaitForHashes] = useState(true);
  const [submitBulkTransactionsEnabled, setSubmitBulkTransactionsEnabled] =
    useState<boolean>(false);
  const { submitBulkTransactions } = useLedger();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    (params.transactionsMapParam ? Object.values(params.transactionsMapParam) : undefined)?.map(
      (tx) => tx
    ) ?? [],
    null
  );

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const { fetchedData } = useFetchFromSessionStorage(
    urlParams.get(STORAGE_MESSAGING_KEY) ?? undefined
  ) as {
    fetchedData: SubmitBulkTransactionsWithKeysRequest | undefined;
  };

  const sendMessageToBackground = useCallback(
    (message: ReceiveSubmitBulkTransactionsBackgroundMessage) => {
      chrome.runtime.sendMessage(message);
      setTransactionProgress(TransactionProgressStatus.IDLE);
    },
    [setTransactionProgress]
  );

  const createMessage = useCallback(
    (messagePayload: {
      txResults: TransactionBulkResponse[] | null | undefined;
      error?: Error;
    }): ReceiveSubmitBulkTransactionsBackgroundMessage => {
      const { txResults, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_SUBMIT_BULK_TRANSACTIONS/V3',
        payload: {
          id: params.id,
          type: ResponseType.Response,
          result: txResults
            ? {
                transactions: txResults
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
        txResults: null,
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
    isBulk: true,
    progressPercentage: progressPercentage,
    badRequestCallback
  });

  const enableBulkTransactionPermission = useCallback(() => {
    saveInChromeLocalStorage(STORAGE_PERMISSION_SUBMIT_BULK, 'true');
    setSubmitBulkTransactionsEnabled(true);
  }, []);

  // Handle stepper
  const steps = params.transactionsMapParam
    ? Math.ceil(Object.values(params.transactionsMapParam || {}).length / MAX_TRANSACTIONS_PER_STEP)
    : 0;
  const handleNext = () => {
    if (activeStep === steps - 1) {
      handleConfirm();
    } else if (activeStep < steps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  useEffect(() => {
    const loadInitialData = async () => {
      const storedData = await loadFromChromeLocalStorage(STORAGE_PERMISSION_SUBMIT_BULK);
      if (!storedData) return;

      setSubmitBulkTransactionsEnabled(storedData === 'true');
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = Number(urlParams.get('id')) || 0;

    if (!fetchedData) {
      return;
    }

    const parsedTransactionsMap = 'transactions' in fetchedData ? fetchedData.transactions : null;

    if (!parsedTransactionsMap) {
      setIsParamsMissing(true);
    }

    const waitForHashes = 'waitForHashes' in fetchedData ? fetchedData.waitForHashes ?? true : true;
    const onError =
      'onError' in fetchedData
        ? fetchedData.onError ?? DEFAULT_SUBMIT_TX_BULK_ON_ERROR
        : DEFAULT_SUBMIT_TX_BULK_ON_ERROR;

    setWaitForHashes(waitForHashes);
    setOnError(onError);
    setParams({
      id,
      transactionsMapParam: parsedTransactionsMap
    });
  }, [fetchedData]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage({
      txResults: null
    });
    sendMessageToBackground(message);
  }, [createMessage, sendMessageToBackground]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // transactionsListParam will be present because if not,
    // we won't be able to go to the confirm transaction state
    const transactionsList = params.transactionsMapParam as Record<number, TransactionWithID>;

    const submitTransactionsInChunks = async (
      transactionsRecord: Record<number, TransactionWithID>,
      onError: TransactionErrorHandling
    ): Promise<TransactionBulkResponse[]> => {
      let results: TransactionBulkResponse[] = [];

      // Convert transactions to array. Sort them by their key to ensure order
      const transactions = Object.entries(transactionsRecord)
        .sort(([keyA], [keyB]) => Number(keyA) - Number(keyB))
        .map(([_, value]) => value);

      // Divide transactions into chunks of five or less
      for (let i = 0; i < transactions.length; i += CHUNK_SIZE) {
        const chunk = transactions.slice(i, i + CHUNK_SIZE);

        try {
          const response = await submitBulkTransactions({
            transactions: chunk,
            onError,
            waitForHashes
          });
          results = [...results, ...response.txResults];

          if (response.hasError && onError === 'abort') {
            setErrorRequestRejection(new Error('Some transactions were rejected'));
            setTransaction(TransactionStatus.Rejected);
            return results;
          }

          const totalTransactions = Object.values(params.transactionsMapParam ?? {}).length;
          setProgressPercentage(Math.floor((results.length / totalTransactions) * 100));

          if (!waitForHashes && i < transactions.length) {
            // Throttle requests
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        } catch (e) {
          throw e;
        }
      }

      setTransaction(TransactionStatus.Success);

      return results;
    };

    submitTransactionsInChunks(transactionsList, onError)
      .then((txResults) => {
        const message = createMessage({
          txResults
        });
        sendMessageToBackground(message);
      })
      .catch((e) => {
        setErrorRequestRejection(e.message);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage({ txResults: null, error: e });
        sendMessageToBackground(message);
      });
  }, [
    params.transactionsMapParam,
    onError,
    submitBulkTransactions,
    waitForHashes,
    createMessage,
    sendMessageToBackground
  ]);
  const { transactionsMapParam } = params;

  const allTransactions = transactionsMapParam ?? {};
  let transactionsToDisplay: Record<number, TransactionWithID> = {};
  let i = 0;
  for (let key in allTransactions) {
    if (allTransactions.hasOwnProperty(key)) {
      if (
        i >= activeStep * MAX_TRANSACTIONS_PER_STEP &&
        i < (activeStep + 1) * MAX_TRANSACTIONS_PER_STEP
      ) {
        transactionsToDisplay[parseInt(key)] = allTransactions[parseInt(key)];
      }
    }
    i++;
  }

  if (transactionStatusComponent) {
    return <div>{transactionStatusComponent}</div>;
  }

  if (!submitBulkTransactionsEnabled) {
    return (
      <PermissionRequiredView
        handleReject={handleReject}
        enableBulkTransactionPermission={enableBulkTransactionPermission}
      />
    );
  }

  return (
    <>
      {showRecap ? (
        <RecapView
          transactionsListParam={Object.values(params.transactionsMapParam ?? {})}
          estimatedFees={estimatedFees}
          errorFees={errorFees}
          hasEnoughFunds={hasEnoughFunds}
          handleReject={handleReject}
          beginProcess={() => setShowRecap(false)}
        />
      ) : (
        <StepperView
          activeStep={activeStep}
          steps={steps}
          hasEnoughFunds={hasEnoughFunds}
          transactionsToDisplay={transactionsToDisplay ?? {}}
          totalNumberOfTransactions={Object.values(params.transactionsMapParam ?? {}).length}
          errorRequestRejection={errorRequestRejection}
          handleBack={handleBack}
          handleReject={handleReject}
          handleNext={handleNext}
          handleConfirm={handleConfirm}
        />
      )}
    </>
  );
};

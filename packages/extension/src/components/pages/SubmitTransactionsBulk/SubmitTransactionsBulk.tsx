import React, { FC, useCallback, useEffect, useState } from 'react';

import * as Sentry from '@sentry/react';

import {
  DEFAULT_SUBMIT_TX_BULK_ON_ERROR,
  GEM_WALLET,
  ReceiveSubmitTransactionsBulkBackgroundMessage,
  ResponseType,
  TransactionBulkResponse,
  TransactionErrorHandling,
  TransactionWithID
} from '@gemwallet/constants';

import { STORAGE_PERMISSION_SUBMIT_BULK } from '../../../constants';
import { useLedger, useNetwork } from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import {
  loadFromChromeLocalStorage,
  loadFromChromeSessionStorage,
  parseTransactionsBulkMap,
  saveInChromeLocalStorage
} from '../../../utils';
import { serializeError } from '../../../utils/errors';
import { PermissionRequiredView } from './PermissionRequiredView';
import { RecapView } from './RecapView';
import { StepperView } from './StepperView';

interface Params {
  id: number;
  // SubmitTransactionsBulk fields
  transactionsMapParam: Record<number, TransactionWithID> | null;
}

export const SubmitTransactionsBulk: FC = () => {
  const MAX_TRANSACTIONS_PER_STEP = 20; // For the stepper
  const CHUNK_SIZE = 5; // For the submitTransactionsBulk calls and the progress bar

  const [params, setParams] = useState<Params>({
    id: 0,
    transactionsMapParam: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const [showRecap, setShowRecap] = useState(true);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [onError, setOnError] = useState<TransactionErrorHandling>(DEFAULT_SUBMIT_TX_BULK_ON_ERROR);
  const [noWait, setNoWait] = useState(false);
  const [submitBulkTransactionsEnabled, setSubmitBulkTransactionsEnabled] =
    useState<boolean>(false);
  const { submitTransactionsBulk } = useLedger();
  const { networkName } = useNetwork();
  const { estimatedFees, errorFees, difference } = useFees(
    (params.transactionsMapParam ? Object.values(params.transactionsMapParam) : undefined)?.map(
      (tx) => tx
    ) ?? {
      TransactionType: 'Payment',
      Account: '',
      Destination: '',
      Amount: ''
    },
    null
  );
  const { hasEnoughFunds, transactionStatusComponent } = useTransactionStatus({
    isParamsMissing,
    errorFees,
    network: networkName,
    difference,
    transaction,
    errorRequestRejection,
    isBulk: true,
    progressPercentage: progressPercentage
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
  const handleReset = () => setActiveStep(0);

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
    let parsedTransactionsMap: Record<number, TransactionWithID> | null = null;

    const fetchData = async () => {
      try {
        const storageKey = urlParams.get('storageKey');

        if (storageKey) {
          const storedData = await loadFromChromeSessionStorage(storageKey, true);
          if (storedData) {
            const parsedStoredData = JSON.parse(storedData);
            if ('transactions' in parsedStoredData) {
              parsedTransactionsMap = parseTransactionsBulkMap(parsedStoredData.transactions);
            }
            if ('noWait' in parsedStoredData) {
              setNoWait(parsedStoredData.noWait === true || parsedStoredData.noWait === 'true');
            }
            if ('onError' in parsedStoredData) {
              const onError =
                parsedStoredData.onError === 'abort' || parsedStoredData.onError === 'continue'
                  ? parsedStoredData.onError
                  : DEFAULT_SUBMIT_TX_BULK_ON_ERROR;
              setOnError(onError);
            }
          }
        }
      } catch (error) {
        Sentry.captureException(error);
      }

      if (!parsedTransactionsMap) {
        setIsParamsMissing(true);
      }

      setParams({
        id,
        transactionsMapParam: parsedTransactionsMap
      });
    };

    fetchData();
  }, []);

  const createMessage = useCallback(
    (messagePayload: {
      txResults: TransactionBulkResponse[] | null | undefined;
      error?: Error;
    }): ReceiveSubmitTransactionsBulkBackgroundMessage => {
      const { txResults, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_SUBMIT_TRANSACTIONS_BULK/V3',
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

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage({
      txResults: null
    });
    chrome.runtime.sendMessage<ReceiveSubmitTransactionsBulkBackgroundMessage>(message);
  }, [createMessage]);

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
        .map(([_, value]) => value as TransactionWithID);

      // Divide transactions into chunks of five or less
      for (let i = 0; i < transactions.length; i += CHUNK_SIZE) {
        const chunk = transactions.slice(i, i + CHUNK_SIZE);

        try {
          const response = await submitTransactionsBulk({
            transactions: chunk,
            onError,
            noWait
          });
          results = [...results, ...response.txResults];

          if (response.hasError && onError === 'abort') {
            setErrorRequestRejection('Some transactions were rejected');
            setTransaction(TransactionStatus.Rejected);
            return results;
          }

          const totalTransactions = Object.values(params.transactionsMapParam || {}).length;
          setProgressPercentage(Math.floor((results.length / totalTransactions) * 100));

          if (noWait && i < transactions.length) {
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
        chrome.runtime.sendMessage<ReceiveSubmitTransactionsBulkBackgroundMessage>(message);
      })
      .catch((e) => {
        setErrorRequestRejection(e.message);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage({ txResults: null, error: e });
        chrome.runtime.sendMessage<ReceiveSubmitTransactionsBulkBackgroundMessage>(message);
      });
  }, [params.transactionsMapParam, onError, submitTransactionsBulk, noWait, createMessage]);
  const { transactionsMapParam } = params;

  const allTransactions = transactionsMapParam || {};
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
          transactionsListParam={Object.values(params.transactionsMapParam || {})}
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
          totalNumberOfTransactions={Object.values(params.transactionsMapParam || {}).length}
          errorRequestRejection={errorRequestRejection}
          handleBack={handleBack}
          handleReject={handleReject}
          handleNext={handleNext}
          handleConfirm={handleConfirm}
          handleReset={handleReset}
        />
      )}
    </>
  );
};

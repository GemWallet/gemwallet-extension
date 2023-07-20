import { FC, useCallback, useEffect, useState } from 'react';

import {
  GEM_WALLET,
  ReceiveSubmitTransactionsBulkBackgroundMessage,
  ResponseType,
  TransactionWithID
} from '@gemwallet/constants';

import { useLedger, useNetwork } from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseTransactionsWithIDListParam } from '../../../utils';
import { serializeError } from '../../../utils/errors';
import RecapView from './RecapView/RecapView';
import StepperView from './StepperView/StepperView';

interface Params {
  id: number;
  // SubmitTransactionsBulk fields
  transactionsListParam: TransactionWithID[] | null;
}

export const SubmitTransactionsBulk: FC = () => {
  const MAX_TRANSACTIONS_PER_STEP = 20; // For the stepper
  const CHUNK_SIZE = 5; // For the submitTransactionsBulk calls and the progress bar

  const [params, setParams] = useState<Params>({
    id: 0,
    transactionsListParam: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const [showRecap, setShowRecap] = useState(true);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const { submitTransactionsBulk } = useLedger();
  const { network } = useNetwork();
  const { estimatedFees, errorFees, difference, errorDifference } = useFees(
    params.transactionsListParam?.map((tx) => tx.transaction) ?? {
      TransactionType: 'Payment',
      Account: '',
      Destination: '',
      Amount: ''
    },
    null
  );
  const { hasEnoughFunds, transactionStatusComponent } = useTransactionStatus({
    isParamsMissing,
    errorDifference,
    network,
    difference,
    transaction,
    errorRequestRejection,
    isBulk: true,
    progressPercentage: progressPercentage
  });

  // Handle stepper
  const steps = params.transactionsListParam
    ? Math.ceil(params.transactionsListParam.length / MAX_TRANSACTIONS_PER_STEP)
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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = Number(urlParams.get('id')) || 0;
    const transactionsListParam = parseTransactionsWithIDListParam(urlParams.get('transactions'));

    if (!transactionsListParam) {
      setIsParamsMissing(true);
    }

    setParams({
      id,
      transactionsListParam
    });
  }, []);

  const createMessage = useCallback(
    (messagePayload: {
      txResults:
        | Array<{
            txID: number;
            hash?: string;
            error?: Error;
          }>
        | null
        | undefined;
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
    const transactionsList = params.transactionsListParam as TransactionWithID[];

    const submitTransactionsInChunks = async (
      transactions: TransactionWithID[]
    ): Promise<{ txID: number; hash?: string; error?: Error }[]> => {
      let results: { txID: number; hash?: string; error?: Error }[] = [];

      // Divide transactions into chunks of five or less
      for (let i = 0; i < transactions.length; i += CHUNK_SIZE) {
        const chunk = transactions.slice(i, i + CHUNK_SIZE);

        try {
          const response = await submitTransactionsBulk({ transactions: chunk });
          results = [...results, ...response.txResults];

          const totalTransactions = params.transactionsListParam?.length || 0;
          setProgressPercentage(Math.floor((results.length / totalTransactions) * 100));
        } catch (e) {
          throw e;
        }
      }

      setTransaction(TransactionStatus.Success);

      return results;
    };

    submitTransactionsInChunks(transactionsList)
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
  }, [params.transactionsListParam, submitTransactionsBulk, createMessage]);
  const { transactionsListParam } = params;

  const transactionsToDisplay = transactionsListParam?.slice(
    activeStep * MAX_TRANSACTIONS_PER_STEP,
    (activeStep + 1) * MAX_TRANSACTIONS_PER_STEP
  );

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : showRecap ? (
        <RecapView
          transactionsListParam={params.transactionsListParam}
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
          transactionsToDisplay={transactionsToDisplay ?? []}
          totalNumberOfTransactions={params.transactionsListParam?.length ?? 0}
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

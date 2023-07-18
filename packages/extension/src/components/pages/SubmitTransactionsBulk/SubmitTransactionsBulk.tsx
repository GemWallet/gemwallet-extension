import { FC, useCallback, useEffect, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Stepper, Step, StepLabel, Typography } from '@mui/material';
import ReactJson from 'react-json-view';

import {
  GEM_WALLET,
  ReceiveSubmitTransactionsBulkBackgroundMessage,
  ResponseType,
  TransactionWithID
} from '@gemwallet/constants';

import { ERROR_RED } from '../../../constants';
import { useLedger, useNetwork } from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseTransactionsWithIDListParam } from '../../../utils';
import { serializeError } from '../../../utils/errors';
import { Fee } from '../../organisms';

interface Params {
  id: number;
  // SubmitTransaction fields
  transactionsListParam: TransactionWithID[] | null;
}

export const SubmitTransactionsBulk: FC = () => {
  const MAX_TRANSACTIONS_PER_STEP = 2;

  const [params, setParams] = useState<Params>({
    id: 0,
    transactionsListParam: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
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
    onClick: () => {
      setTransaction(TransactionStatus.Waiting);
    }
  });

  // Handle stepper
  const steps = params.transactionsListParam
    ? Math.ceil(params.transactionsListParam.length / MAX_TRANSACTIONS_PER_STEP)
    : 0;
  const handleNext = () => {
    if (activeStep < steps - 1) {
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
          result: txResults ? txResults : undefined,
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
    submitTransactionsBulk({
      transactions: params.transactionsListParam?.slice(
        activeStep * MAX_TRANSACTIONS_PER_STEP,
        (activeStep + 1) * MAX_TRANSACTIONS_PER_STEP
      ) as TransactionWithID[]
    })
      .then((response) => {
        setTransaction(TransactionStatus.Success);
        chrome.runtime.sendMessage<ReceiveSubmitTransactionsBulkBackgroundMessage>(
          createMessage(response)
        );
      })
      .catch((e) => {
        setErrorRequestRejection(e.message);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage({
          txResults: null,
          error: e
        });
        chrome.runtime.sendMessage<ReceiveSubmitTransactionsBulkBackgroundMessage>(message);
      });
  }, [submitTransactionsBulk, params.transactionsListParam, activeStep, createMessage]);

  const { transactionsListParam } = params;

  const transactionsToDisplay = transactionsListParam?.slice(
    activeStep * MAX_TRANSACTIONS_PER_STEP,
    (activeStep + 1) * MAX_TRANSACTIONS_PER_STEP
  );

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <>
          <Stepper activeStep={activeStep} alternativeLabel>
            {Array(steps)
              .fill('')
              .map((_, index) => (
                <Step key={index}>
                  <StepLabel>Step {index + 1}</StepLabel>
                </Step>
              ))}
          </Stepper>
          <Fee errorFees={errorFees} estimatedFees={estimatedFees} fee={null} />
          {!hasEnoughFunds ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ErrorIcon style={{ color: ERROR_RED }} />
              <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
                Insufficient funds.
              </Typography>
            </div>
          ) : null}
          {activeStep === steps ? (
            <div>
              <Typography>All steps completed</Typography>
              <Button onClick={handleReset}>Reset</Button>
            </div>
          ) : (
            <div>
              {transactionsToDisplay?.map((tx, index) => (
                <div key={index}>
                  <Typography variant="body1">
                    Transaction Type: {tx.transaction.TransactionType}
                  </Typography>
                  <ReactJson src={tx.transaction} theme="summerfruit" collapsed={true} />
                </div>
              ))}
              {errorRequestRejection && (
                <Typography color="error">{errorRequestRejection}</Typography>
              )}
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button variant="contained" color="secondary" onClick={handleReject}>
                Reject
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps - 1 ? 'Finish' : 'Next'}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleConfirm}
                disabled={!hasEnoughFunds}
              >
                Confirm
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

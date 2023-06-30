import { FC, useCallback, useEffect, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, Paper, Typography } from '@mui/material';
import ReactJson from 'react-json-view';
import { Transaction } from 'xrpl';

import {
  GEM_WALLET,
  ReceiveSubmitTransactionBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import { ERROR_RED } from '../../../constants';
import { useLedger, useNetwork } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import { parseTransactionParam } from '../../../utils';
import { serializeError } from '../../../utils/errors';
import { Fee } from '../../organisms';
import { useFees, useTransactionStatus } from '../../organisms/BaseTransaction/hooks';
import { PageWithTitle } from '../../templates';

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
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { submitTransaction } = useLedger();
  const { network } = useNetwork();
  const { estimatedFees, errorFees, difference, errorDifference } = useFees(
    params.txParam ?? {
      TransactionType: 'Payment',
      Account: '',
      Destination: '',
      Amount: ''
    },
    params.txParam?.Fee ?? null
  );
  const { hasEnoughFunds, transactionStatusComponent } = useTransactionStatus({
    isParamsMissing,
    errorDifference,
    network,
    difference,
    transaction,
    errorRequestRejection
  });

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
    chrome.runtime.sendMessage<ReceiveSubmitTransactionBackgroundMessage>(message);
  }, [createMessage]);

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
        chrome.runtime.sendMessage<ReceiveSubmitTransactionBackgroundMessage>(
          createMessage(response)
        );
      })
      .catch((e) => {
        setErrorRequestRejection(e.message);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage({
          hash: undefined,
          error: e
        });
        chrome.runtime.sendMessage<ReceiveSubmitTransactionBackgroundMessage>(message);
      });
  }, [submitTransaction, params, createMessage]);

  const { txParam } = params;

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <PageWithTitle
          title="Confirm Transaction"
          styles={{ container: { justifyContent: 'initial' } }}
        >
          <div style={{ marginBottom: '40px' }}>
            {!hasEnoughFunds ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ErrorIcon style={{ color: ERROR_RED }} />
                <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
                  Insufficient funds.
                </Typography>
              </div>
            ) : null}
            {txParam ? (
              <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
                <Typography variant="body1">Transaction:</Typography>
                <ReactJson
                  src={txParam}
                  theme="summerfruit"
                  name={null}
                  enableClipboard={false}
                  collapsed={false}
                  onEdit={false}
                  onAdd={false}
                  onDelete={false}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  indentWidth={2}
                />
              </Paper>
            ) : null}
            <Fee
              errorFees={errorFees}
              estimatedFees={estimatedFees}
              fee={txParam?.Fee ? Number(txParam?.Fee) : null}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'fixed',
              bottom: 5,
              left: 0,
              right: 0,
              backgroundColor: '#1d1d1d'
            }}
          >
            <Container style={{ display: 'flex', justifyContent: 'space-evenly', margin: '10px' }}>
              <Button variant="contained" color="secondary" onClick={handleReject}>
                Reject
              </Button>
              <Button variant="contained" onClick={handleConfirm} disabled={!hasEnoughFunds}>
                Confirm
              </Button>
            </Container>
          </div>
        </PageWithTitle>
      )}
    </>
  );
};

import { FC, useCallback, useEffect, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, Paper, Typography } from '@mui/material';
import ReactJson from 'react-json-view';
import { Transaction } from 'xrpl';

import {
  GEM_WALLET,
  ReceiveSignTransactionBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import { ERROR_RED, SECONDARY_GRAY } from '../../../constants';
import { useLedger, useNetwork } from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseTransactionParam } from '../../../utils';
import { serializeError } from '../../../utils/errors';
import { Fee } from '../../organisms';
import DisplayXRPLTransaction from '../../organisms/DisplayXRPLTransaction/DisplayXRPLTransaction';
import { PageWithTitle } from '../../templates';

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
  const { networkName } = useNetwork();
  const { estimatedFees, errorFees, difference } = useFees(
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
    errorFees,
    network: networkName,
    difference,
    transaction,
    errorRequestRejection
  });

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
      signature: null
    });
    chrome.runtime.sendMessage<ReceiveSignTransactionBackgroundMessage>(message);
  }, [createMessage]);

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
        chrome.runtime.sendMessage<ReceiveSignTransactionBackgroundMessage>(
          createMessage(response)
        );
      })
      .catch((e) => {
        setErrorRequestRejection(e);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage({
          signature: undefined,
          error: e
        });
        chrome.runtime.sendMessage<ReceiveSignTransactionBackgroundMessage>(message);
      });
  }, [signTransaction, params, createMessage]);

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
        <PageWithTitle
          title="Sign Transaction"
          styles={{ container: { justifyContent: 'initial' } }}
        >
          <div style={{ marginBottom: '70px' }}>
            {!hasEnoughFunds ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ErrorIcon style={{ color: ERROR_RED }} />
                <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
                  Insufficient funds.
                </Typography>
              </div>
            ) : null}
            {txParam ? (
              <div style={{ marginTop: '5px', marginBottom: '15px' }}>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
                  You are about to sign a transaction, which means that you will grant permission to
                  the third party that initiated this transaction, to submit it to the XRP Ledger on
                  your behalf later.
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '15px' }}>
                  Please review the transaction below.
                </Typography>
              </div>
            ) : null}
            {txParam && txParam.Account ? <DisplayXRPLTransaction tx={txParam} /> : null}
            {txParam && txParam.Account ? (
              <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
                <Typography variant="body1">Raw Transaction:</Typography>
                <ReactJson
                  src={txParam}
                  theme="summerfruit"
                  name={null}
                  enableClipboard={false}
                  collapsed={false}
                  shouldCollapse={false}
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
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#1d1d1d',
              padding: '10px 0'
            }}
          >
            <Container>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography style={{ color: SECONDARY_GRAY, marginBottom: '10px' }}>
                  Only sign with a website you trust
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                  <Button variant="contained" color="secondary" onClick={handleReject}>
                    Reject
                  </Button>
                  <Button variant="contained" onClick={handleSign} disabled={!hasEnoughFunds}>
                    Sign
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        </PageWithTitle>
      )}
    </>
  );
};

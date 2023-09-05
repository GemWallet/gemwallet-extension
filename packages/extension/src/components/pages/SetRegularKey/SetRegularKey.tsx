import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, Paper, Typography } from '@mui/material';
import { isValidAddress } from 'xrpl';

import {
  GEM_WALLET,
  ReceiveSetRegularKeyBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import { ERROR_RED } from '../../../constants';
import {
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress
} from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { fromHexMemos } from '../../../utils';
import {
  BaseTransactionParams,
  getBaseFromParams,
  initialBaseTransactionParams,
  parseBaseParamsFromURLParams
} from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { BaseTransaction } from '../../organisms/BaseTransaction/BaseTransaction';
import { AsyncTransaction, PageWithTitle } from '../../templates';

interface Params extends BaseTransactionParams {
  id: number;
  // SetRegularKey fields
  regularKey: string | null;
}

export const SetRegularKey: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    // BaseTransaction fields
    ...initialBaseTransactionParams,
    // SetRegularKey fields
    regularKey: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { setRegularKey } = useLedger();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'SetRegularKey',
      Account: '',
      ...(params.regularKey ? { RegularKey: params.regularKey } : {})
    },
    params.fee
  );
  const { hasEnoughFunds, transactionStatusComponent } = useTransactionStatus({
    isParamsMissing: false,
    errorFees,
    network: networkName,
    difference,
    transaction,
    errorRequestRejection
  });

  const sendMessageToBackground = useCallback(
    (message: ReceiveSetRegularKeyBackgroundMessage) => {
      chrome.runtime.sendMessage(message);
      setTransactionProgress(TransactionProgressStatus.IDLE);
    },
    [setTransactionProgress]
  );

  const createMessage = useCallback(
    (messagePayload: {
      hash: string | null | undefined;
      error?: Error;
    }): ReceiveSetRegularKeyBackgroundMessage => {
      const { hash, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_SET_REGULAR_KEY/V3',
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

  const isValidRegularKey = useMemo(() => {
    // RegularKey is optional
    if (!params.regularKey) {
      return true;
    }

    return isValidAddress(params.regularKey);
  }, [params.regularKey]);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = Number(urlParams.get('id')) || 0;

    // BaseTransaction fields
    const {
      fee,
      sequence,
      accountTxnID,
      lastLedgerSequence,
      memos,
      signers,
      sourceTag,
      signingPubKey,
      ticketSequence,
      txnSignature
    } = parseBaseParamsFromURLParams(urlParams);

    // SetRegularKey fields
    const regularKey = urlParams.get('regularKey');

    setParams({
      id,
      // BaseTransaction fields
      fee,
      sequence,
      accountTxnID,
      lastLedgerSequence,
      memos,
      signers,
      sourceTag,
      signingPubKey,
      ticketSequence,
      txnSignature,
      // SetRegularKey fields
      regularKey
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
    // NFTokenID will be present because if not,
    // we won't be able to go to the confirm transaction state
    setRegularKey({
      // BaseTransaction fields
      ...getBaseFromParams(params),
      // SetRegularKey fields
      regularKey: params.regularKey || undefined
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
  }, [setRegularKey, params, sendMessageToBackground, createMessage]);

  const {
    // Base transaction params
    fee,
    memos,
    // SetRegularKey params
    regularKey
  } = params;

  const decodedMemos = fromHexMemos(memos || []) || [];

  if (!isValidRegularKey) {
    return (
      <AsyncTransaction
        title="Incorrect transaction"
        subtitle={
          <>
            Your transaction is incorrect.
            <br />
            The regular key is not a valid address.
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <PageWithTitle
          title="Set Regular Key"
          styles={{ container: { justifyContent: 'initial' } }}
        >
          {!hasEnoughFunds ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ErrorIcon style={{ color: ERROR_RED }} />
              <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
                Insufficient funds.
              </Typography>
            </div>
          ) : null}
          {regularKey ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Regular Key:</Typography>
              <Typography variant="body2">{regularKey}</Typography>
            </Paper>
          ) : null}
          <div style={{ marginBottom: '40px' }}>
            <BaseTransaction
              fee={fee ? Number(fee) : null}
              memos={decodedMemos}
              flags={null}
              errorFees={errorFees}
              estimatedFees={estimatedFees}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'fixed',
              bottom: 0,
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

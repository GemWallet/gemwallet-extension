import { FC, useCallback, useEffect, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, Paper, Typography } from '@mui/material';
import { Amount } from 'xrpl/dist/npm/models/common';

import {
  CreateOfferFlags,
  GEM_WALLET,
  ReceiveCreateOfferBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import { ERROR_RED } from '../../../constants';
import { useLedger, useNetwork } from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import {
  formatAmount,
  fromHexMemos,
  handleAmountHexCurrency,
  parseAmount,
  parseCreateOfferFlags
} from '../../../utils';
import {
  BaseTransactionParams,
  getBaseFromParams,
  initialBaseTransactionParams,
  parseBaseParamsFromURLParams
} from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { BaseTransaction } from '../../organisms/BaseTransaction/BaseTransaction';
import { PageWithTitle } from '../../templates';

interface Params extends BaseTransactionParams {
  id: number;
  // CreateOffer fields
  flags: CreateOfferFlags | null;
  expiration: number | null;
  offerSequence: number | null;
  takerGets: Amount | null;
  takerPays: Amount | null;
}

export const CreateOffer: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    // BaseTransaction fields
    ...initialBaseTransactionParams,
    // CreateOffer fields
    flags: null,
    expiration: null,
    offerSequence: null,
    takerGets: null,
    takerPays: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { createOffer } = useLedger();
  const { networkName } = useNetwork();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'OfferCreate',
      Account: '',
      ...(params.flags && { Flags: params.flags }),
      ...(params.expiration && { Expiration: params.expiration }),
      ...(params.offerSequence && { OfferSequence: params.offerSequence }),
      TakerGets: params.takerGets ?? '',
      TakerPays: params.takerPays ?? ''
    },
    params.fee
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
      hash: string | null | undefined;
      error?: Error;
    }): ReceiveCreateOfferBackgroundMessage => {
      const { hash, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_CREATE_OFFER/V3',
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

    // CreateOffer fields
    const flags = parseCreateOfferFlags(urlParams.get('flags'));
    const expiration = urlParams.get('expiration') ? Number(urlParams.get('expiration')) : null;
    const offerSequence = urlParams.get('offerSequence')
      ? Number(urlParams.get('offerSequence'))
      : null;
    const takerGets = urlParams.get('takerGets')
      ? parseAmount(urlParams.get('takerGets'), null, null, '')
      : null;
    const takerPays = urlParams.get('takerPays')
      ? parseAmount(urlParams.get('takerPays'), null, null, '')
      : null;

    if (!takerGets || !takerPays) {
      setIsParamsMissing(true);
    }

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
      // CreateOffer fields
      flags,
      expiration,
      offerSequence,
      takerGets,
      takerPays
    });
  }, []);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage({
      hash: null
    });
    chrome.runtime.sendMessage<ReceiveCreateOfferBackgroundMessage>(message);
  }, [createMessage]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // takerGets and takenPays will be present because if not,
    // we won't be able to go to the confirm transaction state
    handleAmountHexCurrency(params.takerGets as Amount);
    handleAmountHexCurrency(params.takerPays as Amount);
    createOffer({
      // BaseTransaction fields
      ...getBaseFromParams(params),
      // CreateOffer fields
      flags: params.flags || undefined,
      expiration: params.expiration || undefined,
      offerSequence: params.offerSequence || undefined,
      takerGets: params.takerGets as Amount,
      takerPays: params.takerPays as Amount
    })
      .then((response) => {
        setTransaction(TransactionStatus.Success);
        chrome.runtime.sendMessage<ReceiveCreateOfferBackgroundMessage>(createMessage(response));
      })
      .catch((e) => {
        setErrorRequestRejection(e.message);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage({
          hash: undefined,
          error: e
        });
        chrome.runtime.sendMessage<ReceiveCreateOfferBackgroundMessage>(message);
      });
  }, [createOffer, params, createMessage]);

  const {
    // Base transaction params
    fee,
    memos,
    // CreateOffer params
    flags,
    expiration,
    offerSequence,
    takerGets,
    takerPays
  } = params;

  const decodedMemos = fromHexMemos(memos || []) || [];

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <PageWithTitle title="Create Offer" styles={{ container: { justifyContent: 'initial' } }}>
          {!hasEnoughFunds ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ErrorIcon style={{ color: ERROR_RED }} />
              <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
                Insufficient funds.
              </Typography>
            </div>
          ) : null}
          {expiration ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Expiration:</Typography>
              <Typography variant="body2">{expiration}</Typography>
            </Paper>
          ) : null}
          {offerSequence ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Offer sequence:</Typography>
              <Typography variant="body2">{offerSequence}</Typography>
            </Paper>
          ) : null}
          {takerGets ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Taker gets:</Typography>
              <Typography variant="body2">{formatAmount(takerGets)}</Typography>
            </Paper>
          ) : null}
          {takerPays ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Taker pays:</Typography>
              <Typography variant="body2">{formatAmount(takerPays)}</Typography>
            </Paper>
          ) : null}
          <div style={{ marginBottom: '40px' }}>
            <BaseTransaction
              fee={fee ? Number(fee) : null}
              memos={decodedMemos}
              flags={flags}
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

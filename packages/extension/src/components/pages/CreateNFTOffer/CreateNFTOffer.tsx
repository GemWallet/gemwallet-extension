import { FC, useCallback, useEffect, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, Paper, Typography } from '@mui/material';
import { Amount } from 'xrpl/dist/npm/models/common';

import {
  CreateNFTOfferFlags,
  GEM_WALLET,
  ReceiveCreateNFTOfferBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import { ERROR_RED } from '../../../constants';
import {
  TransactionProgressStatuses,
  useLedger,
  useNetwork,
  useTransactionProgress
} from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import {
  createNFTOfferFlagsToNumber,
  formatAmount,
  fromHexMemos,
  handleAmountHexCurrency,
  parseAmount,
  parseCreateNFTOfferFlags
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
  // CreateNFTOffer fields
  NFTokenID: string | null;
  amount: Amount | null;
  owner: string | null;
  expiration: number | null;
  destination: string | null;
  flags: CreateNFTOfferFlags | null;
}

export const CreateNFTOffer: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    // BaseTransaction fields
    ...initialBaseTransactionParams,
    // CreateNFTOffer fields
    NFTokenID: null,
    amount: null,
    owner: null,
    expiration: null,
    destination: null,
    flags: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { createNFTOffer } = useLedger();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'NFTokenCreateOffer',
      Account: '',
      NFTokenID: params.NFTokenID ?? '',
      Amount: params.amount ?? '',
      ...(params.owner && { Owner: params.owner }),
      ...(params.expiration && { Expiration: params.expiration }),
      ...(params.destination && { Destination: params.destination }),
      ...(params.flags && { Flags: params.flags })
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

  const sendMessageToBackground = useCallback(
    (message: ReceiveCreateNFTOfferBackgroundMessage) => {
      chrome.runtime.sendMessage(message);
      setTransactionProgress(TransactionProgressStatuses.IDLE);
    },
    [setTransactionProgress]
  );

  const createMessage = useCallback(
    (messagePayload: {
      hash: string | null | undefined;
      error?: Error;
    }): ReceiveCreateNFTOfferBackgroundMessage => {
      const { hash, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_CREATE_NFT_OFFER/V3',
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

    // CreateNFTOffer fields
    const NFTokenID = urlParams.get('NFTokenID');
    const amount = parseAmount(urlParams.get('amount'), null, null, '');
    const owner = urlParams.get('owner');
    const expiration = urlParams.get('expiration') ? Number(urlParams.get('expiration')) : null;
    const destination = urlParams.get('destination');
    const flags = parseCreateNFTOfferFlags(urlParams.get('flags'));

    if (!amount || !NFTokenID) {
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
      // CreateNFTOffer fields
      NFTokenID,
      amount,
      owner,
      expiration,
      destination,
      flags
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
    // Need to send the flags as number to xrpl.js, otherwise they won't be recognized
    const formattedFlags =
      params.flags && typeof params.flags === 'object'
        ? createNFTOfferFlagsToNumber(params.flags)
        : params.flags;

    setTransaction(TransactionStatus.Pending);
    // Amount and NFTokenID will be present because if not,
    // we won't be able to go to the confirm transaction state
    handleAmountHexCurrency(params.amount as Amount);
    createNFTOffer({
      // BaseTransaction fields
      ...getBaseFromParams(params),
      // CreateNFTOffer fields
      NFTokenID: params.NFTokenID as string,
      amount: params.amount as Amount,
      owner: params.owner || undefined,
      expiration: params.expiration || undefined,
      destination: params.destination || undefined,
      flags: formattedFlags || undefined
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
  }, [params, createNFTOffer, sendMessageToBackground, createMessage]);

  const {
    // Base transaction params
    fee,
    memos,
    // CreateNFTOffer params
    NFTokenID,
    amount,
    owner,
    expiration,
    destination,
    flags
  } = params;

  const decodedMemos = fromHexMemos(memos || []) || [];

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <PageWithTitle
          title="Create NFT Offer"
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
          <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
            <Typography variant="body1">NFT Token ID:</Typography>
            <Typography variant="body2" style={{ wordBreak: 'break-word' }}>
              {NFTokenID}
            </Typography>
          </Paper>
          <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
            <Typography variant="body1">Amount:</Typography>
            <Typography variant="h6" component="h1" align="right">
              {amount ? formatAmount(amount) : 'Not found'}
            </Typography>
          </Paper>
          {owner ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Owner:</Typography>
              <Typography variant="body2">{owner}</Typography>
            </Paper>
          ) : null}
          {expiration ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Expiration:</Typography>
              <Typography variant="body2">{expiration}</Typography>
            </Paper>
          ) : null}
          {destination ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Destination:</Typography>
              <Typography variant="body2">{destination}</Typography>
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

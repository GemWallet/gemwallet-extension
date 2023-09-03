import { FC, useCallback, useEffect, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, Paper, Typography } from '@mui/material';

import {
  GEM_WALLET,
  ReceiveCancelNFTOfferBackgroundMessage,
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
import { fromHexMemos, parseArray } from '../../../utils';
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
  // CancelNFTOffer fields
  NFTokenOffers: string[] | null;
}

export const CancelNFTOffer: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    // BaseTransaction fields
    ...initialBaseTransactionParams,
    // CancelNFTOffer fields
    NFTokenOffers: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { cancelNFTOffer } = useLedger();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'NFTokenCancelOffer',
      Account: '',
      NFTokenOffers: params.NFTokenOffers ?? []
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
    (message: ReceiveCancelNFTOfferBackgroundMessage) => {
      chrome.runtime.sendMessage(message);
      setTransactionProgress(TransactionProgressStatus.IDLE);
    },
    [setTransactionProgress]
  );

  const createMessage = useCallback(
    (messagePayload: {
      hash: string | null | undefined;
      error?: Error;
    }): ReceiveCancelNFTOfferBackgroundMessage => {
      const { hash, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_CANCEL_NFT_OFFER/V3',
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

    // CancelNFTOffer fields
    const NFTokenOffers = parseArray(urlParams.get('NFTokenOffers'));

    if (!NFTokenOffers) {
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
      // CancelNFTOffer fields
      NFTokenOffers
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
    // NFTokenOffers will be present because if not,
    // we won't be able to go to the confirm transaction state
    cancelNFTOffer({
      // BaseTransaction fields
      ...getBaseFromParams(params),
      // CancelNFTOffer fields
      NFTokenOffers: params.NFTokenOffers as string[]
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
  }, [cancelNFTOffer, params, sendMessageToBackground, createMessage]);

  const {
    // Base transaction params
    fee,
    memos,
    // CancelNFTOffer params
    NFTokenOffers
  } = params;

  const decodedMemos = fromHexMemos(memos || []) || [];
  const offers = NFTokenOffers as string[];

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <PageWithTitle
          title="Cancel NFT Offer"
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
          {offers ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Offer IDs:</Typography>
              {offers.map((offer, index) => (
                <div key={index} style={{ marginBottom: index === offer.length - 1 ? 0 : '8px' }}>
                  <Typography
                    variant="body2"
                    style={{
                      wordBreak: 'break-word'
                    }}
                  >
                    {offer}
                  </Typography>
                </div>
              ))}
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

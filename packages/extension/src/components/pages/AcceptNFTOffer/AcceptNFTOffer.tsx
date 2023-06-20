import { FC, useCallback, useEffect, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, Paper, Typography } from '@mui/material';
import { Amount } from 'xrpl/dist/npm/models/common';

import {
  GEM_WALLET,
  ReceiveAcceptNFTOfferBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import { ERROR_RED } from '../../../constants';
import { useLedger, useNetwork } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import { formatAmount, fromHexMemos } from '../../../utils';
import {
  BaseTransactionParams,
  getBaseFromParams,
  initialBaseTransactionParams,
  parseBaseParamsFromURLParams
} from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { BaseTransaction } from '../../organisms/BaseTransaction/BaseTransaction';
import { useFees, useTransactionStatus } from '../../organisms/BaseTransaction/hooks';
import { PageWithTitle } from '../../templates';

interface Params extends BaseTransactionParams {
  id: number;
  // AcceptNFTOffer fields
  NFTokenSellOffer: string | null;
  NFTokenBuyOffer: string | null;
  NFTokenBrokerFee: Amount | null;
}

export const AcceptNFTOffer: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    // BaseTransaction fields
    ...initialBaseTransactionParams,
    // AcceptNFTOffer fields
    NFTokenSellOffer: null,
    NFTokenBuyOffer: null,
    NFTokenBrokerFee: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { acceptNFTOffer } = useLedger();
  const { network } = useNetwork();
  const { estimatedFees, errorFees, difference, errorDifference } = useFees(
    {
      TransactionType: 'NFTokenAcceptOffer',
      Account: '',
      ...(params.NFTokenSellOffer && { NFTokenSellOffer: params.NFTokenSellOffer }),
      ...(params.NFTokenBuyOffer && { NFTokenBuyOffer: params.NFTokenBuyOffer }),
      ...(params.NFTokenBrokerFee && { NFTokenBrokerFee: params.NFTokenBrokerFee })
    },
    params.fee
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
    }): ReceiveAcceptNFTOfferBackgroundMessage => {
      const { hash, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_ACCEPT_NFT_OFFER/V3',
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

    // AcceptNFTOffer fields
    const NFTokenSellOffer = urlParams.get('NFTokenSellOffer');
    const NFTokenBuyOffer = urlParams.get('NFTokenBuyOffer');
    const NFTokenBrokerFee = urlParams.get('NFTokenBrokerFee');

    if (!NFTokenSellOffer && !NFTokenBuyOffer && !NFTokenBrokerFee) {
      // At least one of the fields must be present
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
      // AcceptNFTOffer fields
      NFTokenSellOffer,
      NFTokenBuyOffer,
      NFTokenBrokerFee
    });
  }, []);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage({
      hash: null
    });
    chrome.runtime.sendMessage<ReceiveAcceptNFTOfferBackgroundMessage>(message);
  }, [createMessage]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    acceptNFTOffer({
      // BaseTransaction fields
      ...getBaseFromParams(params),
      // AcceptNFTOffer fields
      ...(params.NFTokenSellOffer && { NFTokenSellOffer: params.NFTokenSellOffer }),
      ...(params.NFTokenBuyOffer && { NFTokenBuyOffer: params.NFTokenBuyOffer }),
      ...(params.NFTokenBrokerFee && { NFTokenBrokerFee: params.NFTokenBrokerFee })
    })
      .then((response) => {
        setTransaction(TransactionStatus.Success);
        chrome.runtime.sendMessage<ReceiveAcceptNFTOfferBackgroundMessage>(createMessage(response));
      })
      .catch((e) => {
        setErrorRequestRejection(e.message);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage({
          hash: undefined,
          error: e
        });
        chrome.runtime.sendMessage<ReceiveAcceptNFTOfferBackgroundMessage>(message);
      });
  }, [acceptNFTOffer, params, createMessage]);

  const {
    // Base transaction params
    fee,
    memos,
    // AcceptNFTOffer params
    NFTokenSellOffer,
    NFTokenBuyOffer,
    NFTokenBrokerFee
  } = params;

  const decodedMemos = fromHexMemos(memos || []) || [];

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <PageWithTitle title="Confirm Transaction">
          {!hasEnoughFunds ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ErrorIcon style={{ color: ERROR_RED }} />
              <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
                Insufficient funds.
              </Typography>
            </div>
          ) : null}
          {NFTokenSellOffer ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">NFT Token Sell Offer:</Typography>
              <Typography
                variant="body2"
                style={{
                  wordBreak: 'break-word'
                }}
              >
                {NFTokenSellOffer}
              </Typography>
            </Paper>
          ) : null}
          {NFTokenBuyOffer ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">NFT Token Buy Offer:</Typography>
              <Typography
                variant="body2"
                style={{
                  wordBreak: 'break-word'
                }}
              >
                {NFTokenBuyOffer}
              </Typography>
            </Paper>
          ) : null}
          {NFTokenBrokerFee ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Broker Fee:</Typography>
              <Typography variant="body2">{formatAmount(NFTokenBrokerFee)}</Typography>
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
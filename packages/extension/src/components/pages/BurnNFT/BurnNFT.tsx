import { FC, useCallback, useEffect, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, Paper, Typography } from '@mui/material';

import { GEM_WALLET, ReceiveBurnNFTBackgroundMessage, ResponseType } from '@gemwallet/constants';

import { ERROR_RED } from '../../../constants';
import { useLedger, useNetwork } from '../../../contexts';
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
import { PageWithTitle } from '../../templates';

interface Params extends BaseTransactionParams {
  id: number;
  // BurnNFT fields
  NFTokenID: string | null;
  owner: string | null;
}

export const BurnNFT: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    // BaseTransaction fields
    ...initialBaseTransactionParams,
    // BurnNFT fields
    NFTokenID: null,
    owner: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { burnNFT } = useLedger();
  const { networkName } = useNetwork();
  const { estimatedFees, errorFees, difference, errorDifference } = useFees(
    {
      TransactionType: 'NFTokenBurn',
      Account: '',
      NFTokenID: params.NFTokenID ?? '',
      ...(params.owner ? { Owner: params.owner } : {})
    },
    params.fee
  );
  const { hasEnoughFunds, transactionStatusComponent } = useTransactionStatus({
    isParamsMissing,
    errorDifference,
    network: networkName,
    difference,
    transaction,
    errorRequestRejection
  });

  const createMessage = useCallback(
    (messagePayload: {
      hash: string | null | undefined;
      error?: Error;
    }): ReceiveBurnNFTBackgroundMessage => {
      const { hash, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_BURN_NFT/V3',
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

    // BurnNFT fields
    const NFTokenID = urlParams.get('NFTokenID');
    const owner = urlParams.get('owner');

    if (!NFTokenID) {
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
      // BurnNFT fields
      NFTokenID,
      owner
    });
  }, []);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage({
      hash: null
    });
    chrome.runtime.sendMessage<ReceiveBurnNFTBackgroundMessage>(message);
  }, [createMessage]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // NFTokenID will be present because if not,
    // we won't be able to go to the confirm transaction state
    burnNFT({
      // BaseTransaction fields
      ...getBaseFromParams(params),
      // BurnNFT fields
      NFTokenID: params.NFTokenID as string,
      ...(params.owner ? { Owner: params.owner } : {})
    })
      .then((response) => {
        setTransaction(TransactionStatus.Success);
        chrome.runtime.sendMessage<ReceiveBurnNFTBackgroundMessage>(createMessage(response));
      })
      .catch((e) => {
        setErrorRequestRejection(e.message);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage({
          hash: undefined,
          error: e
        });
        chrome.runtime.sendMessage<ReceiveBurnNFTBackgroundMessage>(message);
      });
  }, [burnNFT, params, createMessage]);

  const {
    // Base transaction params
    fee,
    memos,
    // BurnNFT params
    NFTokenID,
    owner
  } = params;

  const decodedMemos = fromHexMemos(memos || []) || [];

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <PageWithTitle title="Burn NFT" styles={{ container: { justifyContent: 'initial' } }}>
          {!hasEnoughFunds ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ErrorIcon style={{ color: ERROR_RED }} />
              <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
                Insufficient funds.
              </Typography>
            </div>
          ) : null}
          {NFTokenID ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">NFT Token ID:</Typography>
              <Typography
                variant="body2"
                style={{
                  wordBreak: 'break-word'
                }}
              >
                {NFTokenID}
              </Typography>
            </Paper>
          ) : null}
          {owner ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Owner:</Typography>
              <Typography variant="body2">{owner}</Typography>
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

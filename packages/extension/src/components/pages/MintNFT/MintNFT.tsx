import { FC, useCallback, useEffect, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, Paper, Tooltip, Typography } from '@mui/material';
import { convertHexToString } from 'xrpl';

import {
  GEM_WALLET,
  MintNFTFlags,
  ReceiveMintNFTBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import { ERROR_RED } from '../../../constants';
import { useLedger, useNetwork } from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import {
  formatTransferFee,
  fromHexMemos,
  mintNFTFlagsToNumber,
  parseMintNFTFlags
} from '../../../utils';
import {
  BaseTransactionParams,
  getBaseFromParams,
  initialBaseTransactionParams,
  parseBaseParamsFromURLParams
} from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { BaseTransaction } from '../../organisms';
import { PageWithTitle } from '../../templates';

interface Params extends BaseTransactionParams {
  id: number;
  // MintNFT fields
  URI: string | null;
  flags: MintNFTFlags | null;
  transferFee: number | null;
  NFTokenTaxon: number;
  issuer: string | null;
}

export const MintNFT: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    // BaseTransaction fields
    ...initialBaseTransactionParams,
    // MintNFT fields
    URI: null,
    flags: null,
    transferFee: null,
    NFTokenTaxon: 0,
    issuer: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { mintNFT } = useLedger();
  const { networkName } = useNetwork();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'NFTokenMint',
      Account: '',
      ...(params.URI && { URI: params.URI }),
      ...(params.flags && { Flags: params.flags }),
      ...(params.transferFee && { TransferFee: params.transferFee }),
      NFTokenTaxon: params.NFTokenTaxon,
      ...(params.issuer && { Issuer: params.issuer })
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
      NFTokenID?: string | null | undefined;
      error?: Error;
    }): ReceiveMintNFTBackgroundMessage => {
      const { hash, NFTokenID, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_MINT_NFT/V3',
        payload: {
          id: params.id,
          type: ResponseType.Response,
          result:
            NFTokenID && hash
              ? {
                  hash: hash,
                  NFTokenID: NFTokenID
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

    // MintNFT fields
    const URI = urlParams.get('URI');
    const flags = parseMintNFTFlags(urlParams.get('flags'));
    const transferFee = urlParams.get('transferFee') ? Number(urlParams.get('transferFee')) : null;
    const NFTokenTaxon = Number(urlParams.get('NFTokenTaxon')) ?? 0;
    const issuer = urlParams.get('issuer');

    if (!URI && !flags && !transferFee && !fee) {
      // At least one parameter should be present to mint an NFT
      // It would still work, but we assume it's an error from the caller
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
      // MintNFT fields
      URI,
      flags,
      transferFee,
      NFTokenTaxon,
      issuer
    });
  }, []);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage({
      hash: null,
      NFTokenID: null
    });
    chrome.runtime.sendMessage<ReceiveMintNFTBackgroundMessage>(message);
  }, [createMessage]);

  const handleConfirm = useCallback(() => {
    // Need to send the flags as number to xrpl.js, otherwise they won't be recognized
    const formattedFlags =
      params.flags && typeof params.flags === 'object'
        ? mintNFTFlagsToNumber(params.flags)
        : params.flags;

    setTransaction(TransactionStatus.Pending);
    // Amount and Destination will be present because if not,
    // we won't be able to go to the confirm transaction state
    mintNFT({
      // BaseTransaction fields
      ...getBaseFromParams(params),
      // MintNFT fields
      URI: params.URI || undefined,
      flags: formattedFlags || undefined,
      transferFee: params.transferFee || undefined,
      NFTokenTaxon: params.NFTokenTaxon,
      issuer: params.issuer || undefined
    })
      .then((response) => {
        setTransaction(TransactionStatus.Success);
        chrome.runtime.sendMessage<ReceiveMintNFTBackgroundMessage>(createMessage(response));
      })
      .catch((e) => {
        setErrorRequestRejection(e.message);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage({
          hash: undefined,
          NFTokenID: undefined,
          error: e
        });
        chrome.runtime.sendMessage<ReceiveMintNFTBackgroundMessage>(message);
      });
  }, [mintNFT, params, createMessage]);

  const {
    // Base transaction params
    fee,
    memos,
    // Mint NFT params
    URI,
    flags,
    transferFee,
    NFTokenTaxon,
    issuer
  } = params;

  const decodedMemos = fromHexMemos(memos || []) || [];

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <PageWithTitle title="Mint NFT" styles={{ container: { justifyContent: 'initial' } }}>
          <div style={{ marginBottom: '40px' }}>
            {!hasEnoughFunds ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ErrorIcon style={{ color: ERROR_RED }} />
                <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
                  Insufficient funds.
                </Typography>
              </div>
            ) : null}
            {URI ? (
              <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
                <Typography variant="body1">URI:</Typography>
                <Tooltip title={convertHexToString(URI)}>
                  <Typography
                    variant="body2"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%'
                    }}
                  >
                    <pre style={{ margin: 0 }}>{convertHexToString(URI)}</pre>
                  </Typography>
                </Tooltip>
              </Paper>
            ) : null}
            {transferFee ? (
              <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
                <Typography variant="body1">Transfer Fee:</Typography>
                <Typography variant="body2">{`${formatTransferFee(transferFee)}%`}</Typography>
              </Paper>
            ) : null}
            {issuer ? (
              <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
                <Typography variant="body1">Issuer:</Typography>
                <Typography variant="body2">{issuer}</Typography>
              </Paper>
            ) : null}
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">NFT Taxon:</Typography>
              <Typography variant="body2">{NFTokenTaxon}</Typography>
            </Paper>

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

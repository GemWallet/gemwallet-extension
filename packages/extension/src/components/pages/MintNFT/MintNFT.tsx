import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, Paper, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { NFTokenMintFlagsInterface, convertHexToString } from 'xrpl';

import { GEM_WALLET, ReceiveMintNFTBackgroundMessage, ResponseType } from '@gemwallet/constants';

import { DEFAULT_RESERVE, ERROR_RED } from '../../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import { fromHexMemos, mintNFTFlagsToNumber, parseMintNFTFlags } from '../../../utils';
import {
  BaseTransactionParams,
  getBaseFromParams,
  initialBaseTransactionParams,
  parseBaseParamsFromURLParams
} from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { BaseTransaction } from '../../pages';
import { AsyncTransaction, PageWithSpinner, PageWithTitle } from '../../templates';

const DEFAULT_FEES = 'Loading ...';

interface Params extends BaseTransactionParams {
  id: number;
  // MintNFT fields
  URI: string | null;
  flags: number | NFTokenMintFlagsInterface | null;
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
  const [estimatedFees, setEstimatedFees] = useState<string>(DEFAULT_FEES);
  const [errorFees, setErrorFees] = useState('');
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [difference, setDifference] = useState<number | undefined>();
  const [errorDifference, setErrorDifference] = useState<string | undefined>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);

  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { estimateNetworkFees, mintNFT } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { client, network } = useNetwork();
  const { serverInfo } = useServer();

  // TODO: We need to know what we want to return when NFT is minted.
  const createMessage = useCallback(
    (messagePayload: {
      hash: string | null | undefined;
      NFTokenID?: string | null | undefined;
      URI?: string | null | undefined;
      error?: Error;
    }): ReceiveMintNFTBackgroundMessage => {
      const { hash, NFTokenID, URI, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_MINT_NFT/V3',
        payload: {
          //TODO: Return the right values
          id: params.id,
          type: ResponseType.Response,
          result:
            NFTokenID && hash
              ? {
                  hash: hash,
                  NFTokenID: NFTokenID,
                  URI: URI ?? undefined
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

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && client) {
      estimateNetworkFees({
        TransactionType: 'NFTokenMint',
        Account: currentWallet.publicAddress,
        ...(params.URI && { URI: params.URI }),
        ...(params.flags && { Flags: params.flags }),
        ...(params.transferFee && { TransferFee: params.transferFee }),
        NFTokenTaxon: params.NFTokenTaxon,
        ...(params.issuer && { Issuer: params.issuer })
      })
        .then((fees) => {
          setEstimatedFees(fees);
        })
        .catch((e) => {
          Sentry.captureException(e);
          setErrorFees(e.message);
        });
    }
  }, [
    client,
    estimateNetworkFees,
    getCurrentWallet,
    params.NFTokenTaxon,
    params.URI,
    params.flags,
    params.issuer,
    params.transferFee
  ]);

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet) {
      client
        ?.getXrpBalance(currentWallet.publicAddress)
        .then((currentBalance) => {
          const difference =
            Number(currentBalance) -
            Number(serverInfo?.info.validated_ledger?.reserve_base_xrp || DEFAULT_RESERVE) -
            Number(estimatedFees);
          setDifference(difference);
        })
        .catch((e) => {
          setErrorDifference(e.message);
        });
    }
  }, [
    client,
    getCurrentWallet,
    serverInfo?.info.validated_ledger?.reserve_base_xrp,
    estimatedFees
  ]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage({
      hash: null,
      NFTokenID: null,
      URI: null
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
          URI: undefined,
          error: e
        });
        chrome.runtime.sendMessage<ReceiveMintNFTBackgroundMessage>(message);
      });
  }, [mintNFT, params, createMessage]);

  const hasEnoughFunds = useMemo(() => {
    return Number(difference) > 0;
  }, [difference]);

  if (isParamsMissing) {
    return (
      <AsyncTransaction
        title="Transaction rejected"
        subtitle={
          <>
            Your transaction failed, please try again.
            <br />
            At least one parameter should be provided to the extension.
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (errorDifference) {
    if (errorDifference === 'Account not found.') {
      return (
        <AsyncTransaction
          title="Account not activated"
          subtitle={
            <>
              {`Your account is not activated on the ${network} network.`}
              <br />
              {'Switch network or activate your account.'}
            </>
          }
          transaction={TransactionStatus.Rejected}
        />
      );
    }
    Sentry.captureException('Transaction failed - errorDifference: ' + errorDifference);
    return (
      <AsyncTransaction
        title="Error"
        subtitle={errorDifference}
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (!difference) {
    return <PageWithSpinner />;
  }

  if (transaction === TransactionStatus.Success || transaction === TransactionStatus.Pending) {
    return (
      <AsyncTransaction
        title={
          transaction === TransactionStatus.Success
            ? 'Transaction accepted'
            : 'Transaction in progress'
        }
        subtitle={
          transaction === TransactionStatus.Success ? (
            'Transaction Successful'
          ) : (
            <>
              We are processing your transaction
              <br />
              Please wait
            </>
          )
        }
        transaction={transaction}
      />
    );
  }

  if (transaction === TransactionStatus.Rejected) {
    return (
      <AsyncTransaction
        title="Transaction rejected"
        subtitle={
          <>
            Your transaction failed, please try again.
            <br />
            {errorRequestRejection ? errorRequestRejection : 'Something went wrong'}
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

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
    <PageWithTitle title="Confirm Transaction">
      {!hasEnoughFunds ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ErrorIcon style={{ color: ERROR_RED }} />
          <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
            Insufficient funds.
          </Typography>
        </div>
      ) : null}
      {URI ? (
        <Paper elevation={24} style={{ padding: '10px' }}>
          <Typography variant="body1">URI:</Typography>
          <Typography variant="body2">{convertHexToString(URI)}</Typography>
        </Paper>
      ) : null}
      {transferFee ? (
        <Paper elevation={24} style={{ padding: '10px' }}>
          <Typography variant="body1">Transfer Fee:</Typography>
          <Typography variant="body2">{transferFee}</Typography>
        </Paper>
      ) : null}
      {issuer ? (
        <Paper elevation={24} style={{ padding: '10px' }}>
          <Typography variant="body1">Issuer:</Typography>
          <Typography variant="body2">{issuer}</Typography>
        </Paper>
      ) : null}
      <Paper elevation={24} style={{ padding: '10px' }}>
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
      <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button variant="contained" color="secondary" onClick={handleReject}>
          Reject
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={!hasEnoughFunds}>
          Confirm
        </Button>
      </Container>
    </PageWithTitle>
  );
};

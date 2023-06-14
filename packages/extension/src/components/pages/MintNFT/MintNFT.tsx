import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { NFTokenMintFlagsInterface, convertStringToHex } from 'xrpl';

import { GEM_WALLET, ReceiveMintNFTBackgroundMessage, ResponseType } from '@gemwallet/constants';

import { DEFAULT_RESERVE, ERROR_RED } from '../../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import { formatToken } from '../../../utils';
import { serializeError } from '../../../utils/errors';
import { TileLoader } from '../../atoms';
import { AsyncTransaction, PageWithSpinner, PageWithTitle } from '../../templates';

const DEFAULT_FEES = 'Loading ...';

interface Params {
  id: number;
  URI: string | null;
  flags: number | NFTokenMintFlagsInterface | null;
  //TODO: Maybe we would need the issuer, maybe we can issue for someone else?
  transferFee: number | null;
  NFTokenTaxon: number | null;
}

export const MintNFT: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    URI: null,
    flags: null,
    transferFee: null,
    NFTokenTaxon: null
  });
  const [fees, setFees] = useState<string>(DEFAULT_FEES);
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

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = Number(urlParams.get('id')) || 0;
    const URI = urlParams.get('URI');
    const flags = Number(urlParams.get('flags')) ?? null;
    const transferFee = Number(urlParams.get('transferFee')) ?? 0;
    const NFTokenTaxon = Number(urlParams.get('NFTokenTaxon')) ?? 0;

    if (NFTokenTaxon === null) {
      setIsParamsMissing(true);
    }

    setParams({
      id,
      URI,
      flags,
      transferFee,
      NFTokenTaxon
    });
  }, []);

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (
      currentWallet &&
      client &&
      params.URI !== null &&
      params.flags !== null &&
      params.transferFee !== null &&
      params.NFTokenTaxon !== null
    ) {
      estimateNetworkFees({
        TransactionType: 'NFTokenMint',
        Account: currentWallet.publicAddress,
        URI: convertStringToHex(params.URI),
        Flags: params.flags,
        TransferFee: params.transferFee,
        NFTokenTaxon: params.NFTokenTaxon
      })
        .then((fees) => {
          setFees(fees);
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
            Number(fees);
          setDifference(difference);
        })
        .catch((e) => {
          setErrorDifference(e.message);
        });
    }
  }, [client, getCurrentWallet, serverInfo?.info.validated_ledger?.reserve_base_xrp, fees]);

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
          result: {
            hash: hash || '',
            NFTokenID: NFTokenID || '',
            URI: URI || ''
          },
          error: error ? serializeError(error) : undefined
        }
      };
    },
    [params.id]
  );

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
    setTransaction(TransactionStatus.Pending);
    // Amount and Destination will be present because if not,
    // we won't be able to go to the confirm transaction state
    mintNFT({
      URI: params.URI,
      flags: params.flags,
      transferFee: params.transferFee,
      NFTokenTaxon: params.NFTokenTaxon
    })
      //TODO: Do something with the transaction
      .then((transactionHash) => {
        setTransaction(TransactionStatus.Success);
        // const message = createMessage(transactionHash);
        // chrome.runtime.sendMessage<ReceiveMintNFTBackgroundMessage>(message);
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
  }, [mintNFT, params.URI, params.flags, params.transferFee, params.NFTokenTaxon, createMessage]);

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
            An amount and a destination have not been provided to the extension.
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

  const { URI, flags, transferFee, NFTokenTaxon } = params;

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
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">URI:</Typography>
        <Typography variant="body2">{URI}</Typography>
      </Paper>
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">Flag:</Typography>
        <Typography variant="body2">{flags}</Typography>
      </Paper>
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">Transfer Fee:</Typography>
        <Typography variant="body2">{transferFee}</Typography>
      </Paper>
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">NFT Taxon:</Typography>
        <Typography variant="body2">{NFTokenTaxon}</Typography>
      </Paper>
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="These are the fees to make the transaction over the network">
            <IconButton size="small">
              <ErrorIcon />
            </IconButton>
          </Tooltip>
          Network fees:
        </Typography>
        <Typography variant="body2" gutterBottom align="right">
          {errorFees ? (
            <Typography variant="caption" style={{ color: ERROR_RED }}>
              {errorFees}
            </Typography>
          ) : fees === DEFAULT_FEES ? (
            <TileLoader secondLineOnly />
          ) : (
            formatToken(Number(fees), 'XRP')
          )}
        </Typography>
      </Paper>
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

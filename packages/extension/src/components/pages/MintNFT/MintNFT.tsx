import { FC, useCallback, useEffect, useState } from 'react';

import { NFTokenMint } from 'xrpl/dist/npm/models/transactions/NFTokenMint';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveMintNFTBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import {
  buildNFTokenMint,
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress,
  useWallet
} from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseMintNFTFlags } from '../../../utils';
import { parseBaseParamsFromURLParamsNew } from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { TransactionDetails } from '../../organisms';
import { TransactionPage } from '../../templates';

interface Params {
  id: number;
  transaction: NFTokenMint | null;
}

export const MintNFT: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    transaction: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { mintNFT } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'NFTokenMint',
      Account: '',
      NFTokenTaxon: params.transaction?.NFTokenTaxon ?? 0,
      ...(params.transaction?.URI && { URI: params.transaction.URI }),
      ...(params.transaction?.Flags && { Flags: params.transaction.Flags }),
      ...(params.transaction?.TransferFee && { TransferFee: params.transaction.TransferFee }),
      ...(params.transaction?.Issuer && { Issuer: params.transaction.Issuer })
    },
    params.transaction?.Fee
  );

  const sendMessageToBackground = useCallback(
    (message: ReceiveMintNFTBackgroundMessage) => {
      chrome.runtime.sendMessage(message);
      setTransactionProgress(TransactionProgressStatus.IDLE);
    },
    [setTransactionProgress]
  );

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

  const badRequestCallback = useCallback(() => {
    sendMessageToBackground(
      createMessage({
        hash: null,
        error: new Error(API_ERROR_BAD_REQUEST)
      })
    );
  }, [createMessage, sendMessageToBackground]);

  const { hasEnoughFunds, transactionStatusComponent } = useTransactionStatus({
    isParamsMissing,
    errorFees,
    network: networkName,
    difference,
    transaction,
    errorRequestRejection,
    badRequestCallback
  });

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = Number(urlParams.get('id')) || 0;

    // MintNFT fields
    const URI = urlParams.get('URI');
    const flags = parseMintNFTFlags(urlParams.get('flags'));
    const transferFee = urlParams.get('transferFee') ? Number(urlParams.get('transferFee')) : null;
    const NFTokenTaxon = Number(urlParams.get('NFTokenTaxon')) ?? 0;
    const issuer = urlParams.get('issuer');
    const wallet = getCurrentWallet();

    if (!URI && !flags && !transferFee && !issuer) {
      // At least one parameter should be present to mint an NFT
      // It would still work, but we assume it's an error from the caller
      setIsParamsMissing(true);
    }

    if (!wallet) {
      setIsParamsMissing(true);
      return;
    }

    const transaction = buildNFTokenMint(
      {
        ...parseBaseParamsFromURLParamsNew(urlParams),
        NFTokenTaxon: NFTokenTaxon,
        ...(issuer && { issuer }),
        ...(transferFee && { transferFee }),
        ...(URI && { URI }),
        ...(flags && { flags })
      },
      wallet
    );

    setParams({
      id,
      transaction
    });
  }, [getCurrentWallet]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage({
      hash: null,
      NFTokenID: null
    });
    sendMessageToBackground(message);
  }, [createMessage, sendMessageToBackground]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // Amount and Destination will be present because if not,
    // we won't be able to go to the confirm transaction state
    mintNFT(params.transaction as NFTokenMint)
      .then((response) => {
        setTransaction(TransactionStatus.Success);
        sendMessageToBackground(createMessage(response));
      })
      .catch((e) => {
        setErrorRequestRejection(e);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage({
          hash: undefined,
          NFTokenID: undefined,
          error: e
        });
        sendMessageToBackground(message);
      });
  }, [params, mintNFT, sendMessageToBackground, createMessage]);

  if (transactionStatusComponent) {
    return <div>{transactionStatusComponent}</div>;
  }

  return (
    <TransactionPage
      title="Mint NFT"
      description="Please review the transaction below."
      approveButtonText="Submit"
      hasEnoughFunds={hasEnoughFunds}
      onClickApprove={handleConfirm}
      onClickReject={handleReject}
    >
      <TransactionDetails
        txParam={params.transaction}
        estimatedFees={estimatedFees}
        errorFees={errorFees}
        displayTransactionType={false}
      />
    </TransactionPage>
  );
};

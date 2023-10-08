import { FC, useCallback, useEffect, useState } from 'react';

import { NFTokenCreateOffer } from 'xrpl';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveCreateNFTOfferBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import {
  buildNFTokenCreateOffer,
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress,
  useWallet
} from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseAmount, parseCreateNFTOfferFlags } from '../../../utils';
import { parseBaseParamsFromURLParamsNew } from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { TransactionDetails } from '../../organisms';
import { TransactionPage } from '../../templates';

interface Params {
  id: number;
  transaction: NFTokenCreateOffer | null;
}

export const CreateNFTOffer: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    transaction: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { createNFTOffer } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'NFTokenCreateOffer',
      Account: '',
      NFTokenID: params.transaction?.NFTokenID ?? '',
      Amount: params.transaction?.Amount ?? '',
      ...(params.transaction?.Owner && { Owner: params.transaction.Owner }),
      ...(params.transaction?.Expiration && { Expiration: params.transaction.Expiration }),
      ...(params.transaction?.Destination && { Destination: params.transaction?.Destination }),
      ...(params.transaction?.Flags && { Flags: params.transaction.Flags })
    },
    params.transaction?.Fee
  );

  const sendMessageToBackground = useCallback(
    (message: ReceiveCreateNFTOfferBackgroundMessage) => {
      chrome.runtime.sendMessage(message);
      setTransactionProgress(TransactionProgressStatus.IDLE);
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

    // CreateNFTOffer fields
    const NFTokenID = urlParams.get('NFTokenID');
    const amount = parseAmount(urlParams.get('amount'), null, null, '');
    const owner = urlParams.get('owner');
    const expiration = urlParams.get('expiration') ? Number(urlParams.get('expiration')) : null;
    const destination = urlParams.get('destination');
    const flags = parseCreateNFTOfferFlags(urlParams.get('flags'));
    const wallet = getCurrentWallet();

    if (!amount || !NFTokenID) {
      setIsParamsMissing(true);
    }

    if (!wallet) {
      setIsParamsMissing(true);
      return;
    }

    const transaction = buildNFTokenCreateOffer(
      {
        ...parseBaseParamsFromURLParamsNew(urlParams),
        NFTokenID: NFTokenID ?? '',
        amount: amount ?? '',
        ...(owner && { owner: owner }),
        ...(expiration && { expiration: expiration }),
        ...(destination && { destination: destination }),
        ...(flags && { flags: flags })
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
      hash: null
    });
    sendMessageToBackground(message);
  }, [createMessage, sendMessageToBackground]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // Amount and NFTokenID will be present because if not,
    // we won't be able to go to the confirm transaction state
    createNFTOffer(params.transaction as NFTokenCreateOffer)
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

  if (transactionStatusComponent) {
    return <div>{transactionStatusComponent}</div>;
  }

  return (
    <TransactionPage
      title="Create NFT Offer"
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

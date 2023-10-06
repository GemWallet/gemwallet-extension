import { FC, useCallback, useEffect, useState } from 'react';

import { NFTokenAcceptOffer } from 'xrpl';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveAcceptNFTOfferBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import {
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress,
  useWallet
} from '../../../contexts';
import { buildNFTokenAcceptOffer } from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseAmount } from '../../../utils';
import { parseBaseParamsFromURLParamsNew } from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { TransactionDetails } from '../../organisms';
import { TransactionPage } from '../../templates';

interface Params {
  id: number;
  transaction: NFTokenAcceptOffer | null;
}

export const AcceptNFTOffer: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    transaction: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { acceptNFTOffer } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'NFTokenAcceptOffer',
      Account: '',
      ...(params.transaction?.NFTokenSellOffer && {
        NFTokenSellOffer: params.transaction.NFTokenSellOffer
      }),
      ...(params.transaction?.NFTokenBuyOffer && {
        NFTokenBuyOffer: params.transaction.NFTokenBuyOffer
      }),
      ...(params.transaction?.NFTokenBrokerFee && {
        NFTokenBrokerFee: params.transaction.NFTokenBrokerFee
      })
    },
    params.transaction?.Fee
  );

  const sendMessageToBackground = useCallback(
    (message: ReceiveAcceptNFTOfferBackgroundMessage) => {
      chrome.runtime.sendMessage(message);
      setTransactionProgress(TransactionProgressStatus.IDLE);
    },
    [setTransactionProgress]
  );

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

    // AcceptNFTOffer fields
    const NFTokenSellOffer = urlParams.get('NFTokenSellOffer');
    const NFTokenBuyOffer = urlParams.get('NFTokenBuyOffer');
    const NFTokenBrokerFee = parseAmount(urlParams.get('NFTokenBrokerFee'), null, null, '');
    const wallet = getCurrentWallet();

    if (!NFTokenSellOffer && !NFTokenBuyOffer && !NFTokenBrokerFee) {
      // At least one of the fields must be present
      setIsParamsMissing(true);
    }

    if (!wallet) {
      setIsParamsMissing(true);
      return;
    }

    const transaction = buildNFTokenAcceptOffer(
      {
        ...parseBaseParamsFromURLParamsNew(urlParams),
        ...(NFTokenSellOffer && { NFTokenSellOffer }),
        ...(NFTokenBuyOffer && { NFTokenBuyOffer }),
        ...(NFTokenBrokerFee && { NFTokenBrokerFee })
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
    acceptNFTOffer(params.transaction as NFTokenAcceptOffer)
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
  }, [params, acceptNFTOffer, sendMessageToBackground, createMessage]);

  if (transactionStatusComponent) {
    return <div>{transactionStatusComponent}</div>;
  }

  return (
    <TransactionPage
      title="Accept NFT Offer"
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

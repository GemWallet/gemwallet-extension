import { FC, useCallback, useEffect, useState } from 'react';

import { OfferCreate } from 'xrpl';

import {
  API_ERROR_BAD_REQUEST,
  CreateOfferRequest,
  GEM_WALLET,
  ReceiveCreateOfferBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import { STORAGE_MESSAGING_KEY } from '../../../constants';
import {
  buildOfferCreate,
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress,
  useWallet
} from '../../../contexts';
import { useFees, useFetchFromSessionStorage, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseAmount, parseCreateOfferFlags } from '../../../utils';
import { parseBaseParamsFromStoredData } from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { TransactionDetails } from '../../organisms';
import { TransactionPage } from '../../templates';

interface Params {
  id: number;
  transaction: OfferCreate | null;
}

export const CreateOffer: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    transaction: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { createOffer } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, minimumFees, errorFees, difference } = useFees(
    params.transaction ?? [],
    params.transaction?.Fee
  );

  const urlParams = new URLSearchParams(window.location.search);
  const { fetchedData } = useFetchFromSessionStorage(
    urlParams.get(STORAGE_MESSAGING_KEY) ?? undefined
  ) as {
    fetchedData: CreateOfferRequest | undefined;
  };

  const sendMessageToBackground = useCallback(
    (message: ReceiveCreateOfferBackgroundMessage) => {
      chrome.runtime.sendMessage(message);
      setTransactionProgress(TransactionProgressStatus.IDLE);
    },
    [setTransactionProgress]
  );

  const createMessage = useCallback(
    (messagePayload: {
      hash: string | null | undefined;
      error?: Error;
    }): ReceiveCreateOfferBackgroundMessage => {
      const { hash, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_CREATE_OFFER/V3',
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
    const urlParams = new URLSearchParams(window.location.search);
    const id = Number(urlParams.get('id')) || 0;
    const wallet = getCurrentWallet();

    if (!wallet) {
      setIsParamsMissing(true);
      return;
    }

    if (!fetchedData) {
      return;
    }

    const flags = 'flags' in fetchedData ? parseCreateOfferFlags(fetchedData.flags) : undefined;
    const expiration = 'expiration' in fetchedData ? Number(fetchedData.expiration) : undefined;
    const offerSequence =
      'offerSequence' in fetchedData ? Number(fetchedData.offerSequence) : undefined;
    const takerGets =
      'takerGets' in fetchedData ? parseAmount(fetchedData.takerGets, null, null, '') : undefined;
    const takerPays =
      'takerPays' in fetchedData ? parseAmount(fetchedData.takerPays, null, null, '') : undefined;

    if (!takerGets || !takerPays) {
      setIsParamsMissing(true);
    }

    const transaction = buildOfferCreate(
      {
        ...parseBaseParamsFromStoredData(fetchedData),
        takerGets: takerGets ?? '0',
        takerPays: takerPays ?? '0',
        ...(flags && { flags }),
        ...(expiration && { expiration }),
        ...(offerSequence && { offerSequence })
      },
      wallet
    );

    setParams({
      id,
      transaction
    });
  }, [fetchedData, getCurrentWallet]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage({
      hash: null
    });
    sendMessageToBackground(message);
  }, [createMessage, sendMessageToBackground]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // takerGets and takenPays will be present because if not,
    // we won't be able to go to the confirm transaction state
    createOffer(params.transaction as OfferCreate)
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
  }, [params, createOffer, sendMessageToBackground, createMessage]);

  const handleFeeChange = useCallback(
    (fee: number) => {
      if (params.transaction) {
        setParams({
          ...params,
          transaction: {
            ...params.transaction,
            Fee: fee.toString()
          }
        });
      }
    },
    [params]
  );

  if (transactionStatusComponent) {
    return <div>{transactionStatusComponent}</div>;
  }

  return (
    <TransactionPage
      title="Create Offer"
      description="Please review the transaction below."
      approveButtonText="Submit"
      hasEnoughFunds={hasEnoughFunds}
      onClickApprove={handleConfirm}
      onClickReject={handleReject}
    >
      <TransactionDetails
        txParam={params.transaction}
        estimatedFees={estimatedFees}
        minimumFees={minimumFees}
        errorFees={errorFees}
        displayTransactionType={false}
        onFeeChange={handleFeeChange}
      />
    </TransactionPage>
  );
};

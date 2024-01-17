import { FC, useCallback, useEffect, useState } from 'react';

import {
  Chain,
  GEM_WALLET,
  ReceiveSetHookBackgroundMessage,
  ResponseType,
  SetHookRequest,
  SetHook as SetHookTransaction
} from '@gemwallet/constants';

import { STORAGE_MESSAGING_KEY } from '../../../constants';
import { buildSetHook, useLedger, useNetwork, useWallet } from '../../../contexts';
import { useFees, useFetchFromSessionStorage, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseBaseParamsFromStoredData } from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { TransactionDetails } from '../../organisms';
import { LoadingOverlay, TransactionPage } from '../../templates';

interface Params {
  id: number;
  transaction: SetHookTransaction | null;
}

export const SetHook: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    transaction: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { setHook } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { chainName, networkName } = useNetwork();
  const { hasEnoughFunds, transactionStatusComponent } = useTransactionStatus({
    isParamsMissing,
    errorFees: undefined,
    network: networkName,
    difference: 1,
    transaction,
    errorRequestRejection,
    errorValue: chainName !== Chain.XAHAU ? 'You must be connected to the Xahau network' : undefined
  });

  const urlParams = new URLSearchParams(window.location.search);
  const { fetchedData } = useFetchFromSessionStorage(
    urlParams.get(STORAGE_MESSAGING_KEY) ?? undefined
  ) as {
    fetchedData: SetHookRequest | undefined;
  };
  const { estimatedFees, errorFees } = useFees(params.transaction ?? [], params.transaction?.Fee);

  const createMessage = useCallback(
    (messagePayload: {
      hash: string | null | undefined;
      error?: Error;
    }): ReceiveSetHookBackgroundMessage => {
      const { hash, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_SET_HOOK/V3',
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

    const hooks = 'hooks' in fetchedData ? fetchedData.hooks : undefined;

    if (!hooks || !hooks.length) {
      setIsParamsMissing(true);
      return;
    }

    const transaction = buildSetHook(
      {
        ...parseBaseParamsFromStoredData(fetchedData),
        hooks: hooks
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
    chrome.runtime.sendMessage<ReceiveSetHookBackgroundMessage>(message);
  }, [createMessage]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // hooks will be present because if not,
    // we won't be able to go to the confirm transaction state
    setHook(params.transaction as SetHookTransaction)
      .then((response) => {
        setTransaction(TransactionStatus.Success);
        chrome.runtime.sendMessage<ReceiveSetHookBackgroundMessage>(createMessage(response));
      })
      .catch((e) => {
        setErrorRequestRejection(e);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage({
          hash: undefined,
          error: e
        });
        chrome.runtime.sendMessage<ReceiveSetHookBackgroundMessage>(message);
      });
  }, [setHook, params, createMessage]);

  if (params.transaction === null) {
    return <LoadingOverlay />;
  }

  if (transactionStatusComponent) {
    return <div>{transactionStatusComponent}</div>;
  }

  return (
    <TransactionPage
      title="Set Hook"
      description="Please review the data below."
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

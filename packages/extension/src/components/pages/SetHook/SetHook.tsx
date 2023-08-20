import React, { FC, useCallback, useEffect, useState } from 'react';

import {
  Chain,
  GEM_WALLET,
  Hook,
  ReceiveSetHookBackgroundMessage,
  ResponseType,
  SetHookRequest
} from '@gemwallet/constants';

import { STORAGE_MESSAGING_KEY } from '../../../constants';
import { useLedger, useNetwork } from '../../../contexts';
import { useFetchFromSessionStorage, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { serializeError } from '../../../utils/errors';
import { LoadingOverlay, TransactionPage } from '../../templates';
import { HooksDisplay } from './HooksDisplay';

interface Params {
  id: number;
  hooks: Hook[] | null;
}

export const SetHook: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    hooks: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { setHook } = useLedger();
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

    if (!fetchedData) {
      return;
    }

    const hooks = 'hooks' in fetchedData ? fetchedData.hooks : undefined;

    if (!hooks || !hooks.length) {
      setIsParamsMissing(true);
      return;
    }

    setParams({
      id,
      hooks
    });
  }, [fetchedData]);

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
    setHook({
      hooks: params.hooks || []
    })
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

  if (params.hooks === null) {
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
      <HooksDisplay hooks={params.hooks ?? []} fontSize={12} />
    </TransactionPage>
  );
};

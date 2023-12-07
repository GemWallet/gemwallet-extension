import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { isValidAddress, SetRegularKey as SetRegularKeyXRPL } from 'xrpl';

import {
  GEM_WALLET,
  ReceiveSetRegularKeyBackgroundMessage,
  ResponseType,
  SetRegularKeyRequest
} from '@gemwallet/constants';

import { HOME_PATH, STORAGE_MESSAGING_KEY } from '../../../constants';
import {
  buildSetRegularKey,
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress,
  useWallet
} from '../../../contexts';
import { useFees, useFetchFromSessionStorage, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseBaseParamsFromStoredData } from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { TransactionDetails } from '../../organisms';
import { AsyncTransaction, TransactionPage } from '../../templates';
import { SetRegularKeyForm } from './SetRegularKeyForm';

interface Params {
  id: number;
  transaction: SetRegularKeyXRPL | null;
}

export const SetRegularKey: FC = () => {
  const inAppCall = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('inAppCall') === 'true' || false;
  }, []);

  const [params, setParams] = useState<Params>({
    id: 0,
    transaction: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const [inputRegularKey, setInputRegularKey] = useState<string | null>(null);
  const [inputRegularKeyError, setInputRegularKeyError] = useState<string>('');
  const [removeKeyChecked, setRemoveKeyChecked] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { setRegularKey, getAccountInfo } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    params.transaction ?? [],
    params.transaction?.Fee
  );
  const navigate = useNavigate();
  const { hasEnoughFunds, transactionStatusComponent } = useTransactionStatus({
    isParamsMissing,
    errorFees,
    network: networkName,
    difference,
    transaction,
    errorRequestRejection,
    onClick: inAppCall ? () => navigate(HOME_PATH) : undefined
  });

  const urlParams = new URLSearchParams(window.location.search);
  const { fetchedData } = useFetchFromSessionStorage(
    urlParams.get(STORAGE_MESSAGING_KEY) ?? undefined
  ) as {
    fetchedData: SetRegularKeyRequest | undefined;
  };

  const sendMessageToBackground = useCallback(
    (message: ReceiveSetRegularKeyBackgroundMessage) => {
      if (!inAppCall) {
        chrome.runtime.sendMessage(message);
        setTransactionProgress(TransactionProgressStatus.IDLE);
      }
    },

    [inAppCall, setTransactionProgress]
  );

  const createMessage = useCallback(
    (messagePayload: {
      hash: string | null | undefined;
      error?: Error;
    }): ReceiveSetRegularKeyBackgroundMessage => {
      const { hash, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_SET_REGULAR_KEY/V3',
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

  const isValidRegularKey = useMemo(() => {
    // RegularKey is optional
    if (!inputRegularKey) {
      return true;
    }

    return isValidAddress(inputRegularKey);
  }, [inputRegularKey]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputRegularKey(e.target.value);

    if (e.target.value !== '' && !isValidAddress(e.target.value)) {
      // We only accept valid addresses and empty strings (for removing the regular key)
      setInputRegularKeyError('The regular key is not a valid address');
    } else {
      setInputRegularKeyError('');
    }
  };

  // Modify this to handle checkbox changes
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRemoveKeyChecked(e.target.checked);
    if (e.target.checked) {
      setInputRegularKey(null);
      setInputRegularKeyError('');
    }
  };

  useEffect(() => {
    getAccountInfo().then((accountInfo) => {
      const currentRegularKey = accountInfo.result.account_data.RegularKey;
      if (currentRegularKey) {
        setInputRegularKey(currentRegularKey);
      }
    });
  }, [getAccountInfo]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = Number(urlParams.get('id')) || 0;
    const wallet = getCurrentWallet();

    if (!wallet) {
      setIsParamsMissing(true);
      return;
    }

    if (!fetchedData && !inAppCall) {
      // We only need to fetch the data in case of an API call
      return;
    }

    let regularKey = undefined;
    if (fetchedData) {
      regularKey = 'regularKey' in fetchedData ? fetchedData.regularKey : undefined;
    }

    // UI specific
    const finalRegularKey =
      inAppCall && removeKeyChecked ? undefined : inAppCall ? inputRegularKey : regularKey;

    const baseParams = fetchedData ? parseBaseParamsFromStoredData(fetchedData) : {};
    const transaction = buildSetRegularKey(
      {
        ...baseParams,
        ...(finalRegularKey && { regularKey: finalRegularKey ?? undefined })
      },
      wallet
    );

    setParams({
      id,
      transaction
    });
  }, [fetchedData, getAccountInfo, getCurrentWallet, inAppCall, inputRegularKey, removeKeyChecked]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage({
      hash: null
    });
    sendMessageToBackground(message);
  }, [createMessage, sendMessageToBackground]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    setRegularKey(params.transaction as SetRegularKeyXRPL)
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
  }, [params, setRegularKey, sendMessageToBackground, createMessage]);

  if (!isValidRegularKey && !inAppCall) {
    return (
      <AsyncTransaction
        title="Incorrect transaction"
        subtitle={
          <>
            Your transaction is incorrect.
            <br />
            The regular key is not a valid address.
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (transactionStatusComponent) {
    return <div>{transactionStatusComponent}</div>;
  }

  if (inAppCall && !isFormSubmitted) {
    return (
      <SetRegularKeyForm
        hasEnoughFunds={hasEnoughFunds}
        inputRegularKey={inputRegularKey}
        inputRegularKeyError={inputRegularKeyError}
        removeKeyChecked={removeKeyChecked}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        onClickApprove={() => setIsFormSubmitted(true)}
        isApproveEnabled={inputRegularKeyError === ''}
      />
    );
  }

  return (
    <TransactionPage
      title="Set Regular Key"
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
        displayTransactionType={true}
      />
    </TransactionPage>
  );
};

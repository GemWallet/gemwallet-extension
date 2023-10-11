import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { isValidAddress, SetRegularKey as SetRegularKeyXRPL } from 'xrpl';

import {
  GEM_WALLET,
  ReceiveSetRegularKeyBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import { HOME_PATH } from '../../../constants';
import {
  buildSetRegularKey,
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress,
  useWallet
} from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseBaseParamsFromURLParamsNew } from '../../../utils/baseParams';
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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
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
  const { setRegularKey, getAccountInfo } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'SetRegularKey',
      Account: '',
      ...(params.transaction?.RegularKey ? { RegularKey: params.transaction.RegularKey } : {})
    },
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

  useEffect(() => {
    getAccountInfo().then((accountInfo) => {
      const currentRegularKey = accountInfo.result.account_data.RegularKey;
      if (currentRegularKey) {
        setInputRegularKey(currentRegularKey);
      }
    });
  }, [getAccountInfo]);

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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = Number(urlParams.get('id')) || 0;

    // SetRegularKey fields
    const regularKey = urlParams.get('regularKey');
    const wallet = getCurrentWallet();

    if (!wallet) {
      setIsParamsMissing(true);
      return;
    }

    // UI specific
    const finalRegularKey =
      inAppCall && removeKeyChecked ? undefined : inAppCall ? inputRegularKey : regularKey;

    const transaction = buildSetRegularKey(
      {
        ...parseBaseParamsFromURLParamsNew(urlParams),
        ...(finalRegularKey && { regularKey: finalRegularKey ?? undefined })
      },
      wallet
    );

    setParams({
      id,
      transaction
    });
  }, [getAccountInfo, getCurrentWallet, inAppCall, inputRegularKey, removeKeyChecked]);

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

  if (inAppCall) {
    return (
      <SetRegularKeyForm
        hasEnoughFunds={hasEnoughFunds}
        inputRegularKey={inputRegularKey}
        inputRegularKeyError={inputRegularKeyError}
        removeKeyChecked={removeKeyChecked}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        onClickApprove={handleConfirm}
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
        displayTransactionType={false}
      />
    </TransactionPage>
  );
};

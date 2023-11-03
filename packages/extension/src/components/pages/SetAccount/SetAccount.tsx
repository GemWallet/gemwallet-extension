import { FC, useCallback, useEffect, useState } from 'react';

import { AccountSet } from 'xrpl';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveSetAccountBackgroundMessage,
  ResponseType,
  SetAccountRequest
} from '@gemwallet/constants';

import { STORAGE_MESSAGING_KEY } from '../../../constants';
import {
  buildAccountSet,
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress,
  useWallet
} from '../../../contexts';
import { useFees, useFetchFromSessionStorage, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseSetAccountFlags } from '../../../utils';
import { parseBaseParamsFromStoredData } from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { TransactionDetails } from '../../organisms';
import { TransactionPage } from '../../templates';

interface Params {
  id: number;
  transaction: AccountSet | null;
}

export const SetAccount: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    transaction: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { setAccount } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    params.transaction ?? [],
    params.transaction?.Fee
  );

  const urlParams = new URLSearchParams(window.location.search);
  const { fetchedData } = useFetchFromSessionStorage(
    urlParams.get(STORAGE_MESSAGING_KEY) ?? undefined
  ) as {
    fetchedData: SetAccountRequest | undefined;
  };

  const sendMessageToBackground = useCallback(
    (message: ReceiveSetAccountBackgroundMessage) => {
      chrome.runtime.sendMessage(message);
      setTransactionProgress(TransactionProgressStatus.IDLE);
    },
    [setTransactionProgress]
  );

  const createMessage = useCallback(
    (messagePayload: {
      hash: string | null | undefined;
      error?: Error;
    }): ReceiveSetAccountBackgroundMessage => {
      const { hash, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_SET_ACCOUNT/V3',
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

    const flags = 'flags' in fetchedData ? parseSetAccountFlags(fetchedData.flags) : undefined;
    const clearFlag = 'clearFlag' in fetchedData ? Number(fetchedData.clearFlag) : undefined;
    const domain = 'domain' in fetchedData ? fetchedData.domain : undefined;
    const emailHash = 'emailHash' in fetchedData ? fetchedData.emailHash : undefined;
    const messageKey = 'messageKey' in fetchedData ? fetchedData.messageKey : undefined;
    const NFTokenMinter = 'NFTokenMinter' in fetchedData ? fetchedData.NFTokenMinter : undefined;
    const setFlag = 'setFlag' in fetchedData ? Number(fetchedData.setFlag) : undefined;
    const transferRate =
      'transferRate' in fetchedData ? Number(fetchedData.transferRate) : undefined;
    const tickSize = 'tickSize' in fetchedData ? Number(fetchedData.tickSize) : undefined;

    if (
      !flags &&
      !clearFlag &&
      !domain &&
      !emailHash &&
      !messageKey &&
      !NFTokenMinter &&
      !setFlag &&
      !transferRate &&
      !tickSize
    ) {
      setIsParamsMissing(true);
    }

    const transaction = buildAccountSet(
      {
        ...parseBaseParamsFromStoredData(fetchedData),
        ...(flags && { flags }),
        ...(clearFlag && { clearFlag }),
        ...(domain && { domain }),
        ...(emailHash && { emailHash }),
        ...(messageKey && { messageKey }),
        ...(setFlag && { setFlag }),
        ...(transferRate && { transferRate }),
        ...(tickSize && { tickSize }),
        ...(NFTokenMinter && { NFTokenMinter })
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
    // NFTokenID will be present because if not,
    // we won't be able to go to the confirm transaction state
    setAccount(params.transaction as AccountSet)
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
  }, [setAccount, params, sendMessageToBackground, createMessage]);

  if (transactionStatusComponent) {
    return <div>{transactionStatusComponent}</div>;
  }

  return (
    <TransactionPage
      title="Set Account"
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

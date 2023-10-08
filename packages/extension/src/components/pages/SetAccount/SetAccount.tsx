import { FC, useCallback, useEffect, useState } from 'react';

import { AccountSet } from 'xrpl';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveSetAccountBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import {
  buildAccountSet,
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress,
  useWallet
} from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseSetAccountFlags } from '../../../utils';
import { parseBaseParamsFromURLParamsNew } from '../../../utils/baseParams';
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
    {
      TransactionType: 'AccountSet',
      Account: '',
      ...(params.transaction?.Flags ? { Flags: params.transaction.Flags } : {}),
      ...(params.transaction?.ClearFlag ? { ClearFlag: params.transaction.ClearFlag } : {}),
      ...(params.transaction?.Domain ? { Domain: params.transaction.Domain } : {}),
      ...(params.transaction?.EmailHash ? { EmailHash: params.transaction.EmailHash } : {}),
      ...(params.transaction?.MessageKey ? { MessageKey: params.transaction.MessageKey } : {}),
      ...(params.transaction?.NFTokenMinter
        ? { NFTokenMinter: params.transaction.NFTokenMinter }
        : {}),
      ...(params.transaction?.SetFlag ? { SetFlag: params.transaction.SetFlag } : {}),
      ...(params.transaction?.TransferRate
        ? { TransferRate: params.transaction.TransferRate }
        : {}),
      ...(params.transaction?.TickSize ? { TickSize: params.transaction.TickSize } : {})
    },
    params.transaction?.Fee
  );

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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = Number(urlParams.get('id')) || 0;

    // SetAccount fields
    const flags = parseSetAccountFlags(urlParams.get('flags'));
    const clearFlag = Number(urlParams.get('clearFlag')) || null;
    const domain = urlParams.get('domain');
    const emailHash = urlParams.get('emailHash');
    const messageKey = urlParams.get('messageKey');
    const NFTokenMinter = urlParams.get('NFTokenMinter');
    const setFlag = Number(urlParams.get('setFlag')) || null;
    const transferRate = Number(urlParams.get('transferRate')) || null;
    const tickSize = Number(urlParams.get('tickSize')) || null;
    const wallet = getCurrentWallet();

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

    if (!wallet) {
      setIsParamsMissing(true);
      return;
    }

    const transaction = buildAccountSet(
      {
        ...parseBaseParamsFromURLParamsNew(urlParams),
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

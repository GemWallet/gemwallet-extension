import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';
import ReactJson from 'react-json-view';

import {
  AlicesRingMessage,
  AlicesRingP0,
  GEM_WALLET,
  ReceiveSignAlicesRingBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import {
  TransactionProgressStatus,
  useNetwork,
  useTransactionProgress,
  useWallet
} from '../../../contexts';
import { useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { loadFromChromeSessionStorage } from '../../../utils';
import { sign } from '../../../utils/cypherLab/piSignature';
import { serializeError } from '../../../utils/errors';
import { DataCard } from '../../molecules';
import { TransactionPage } from '../../templates';

interface Params {
  id: number;
  // SignAlicesRing fields
  message: AlicesRingMessage | null;
  owningAddress: string | null;
  ring: string[] | null;
  curve: string | null;
}

export const SignAlicesRing: FC = () => {
  const { getCurrentWallet } = useWallet();
  const [params, setParams] = useState<Params>({
    id: 0,
    // SignAlicesRing fields
    message: null,
    owningAddress: null,
    ring: null,
    curve: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);
  const [isOwningAddressExpanded, setIsOwningAddressExpanded] = useState(false);
  const [isParamsExpanded, setIsParamsExpanded] = useState(false);
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { transactionStatusComponent } = useTransactionStatus({
    isParamsMissing,
    errorFees: undefined,
    network: networkName,
    difference: 1,
    transaction,
    errorRequestRejection
  });

  const ownerPrivateKey = useMemo<string | null>(() => {
    const wallet = getCurrentWallet();
    return wallet?.wallet.privateKey || null;
  }, [getCurrentWallet]);

  const sendMessageToBackground = useCallback(
    (message: ReceiveSignAlicesRingBackgroundMessage) => {
      chrome.runtime.sendMessage(message);
      setTransactionProgress(TransactionProgressStatus.IDLE);
    },
    [setTransactionProgress]
  );

  const createMessage = useCallback(
    (messagePayload: {
      ringSignature: string | null | undefined;
      error?: Error;
    }): ReceiveSignAlicesRingBackgroundMessage => {
      const { ringSignature, error } = messagePayload;
      return {
        app: GEM_WALLET,
        type: 'RECEIVE_SIGN_ALICES_RING/V3',
        payload: {
          id: params.id,
          type: ResponseType.Response,
          result: ringSignature ? { ringSignature } : undefined,
          error: error ? serializeError(error) : undefined
        }
      };
    },
    [params.id]
  );

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = Number(urlParams.get('id')) || 0;
    let p0: AlicesRingP0 | null = null;

    const fetchData = async () => {
      try {
        const storageKey = urlParams.get('storageKey');

        if (storageKey) {
          const storedData = await loadFromChromeSessionStorage(storageKey, true);
          if (storedData) {
            const parsedStoredData = JSON.parse(storedData);
            if ('p0' in parsedStoredData) {
              p0 = parsedStoredData.p0;
            }
          }
        }
      } catch (error) {
        Sentry.captureException(error);
      }

      if (!p0?.message || !p0?.owningAddress || !p0?.ring || !p0?.curve) {
        setIsParamsMissing(true);
        return;
      }

      setParams({
        id,
        // SignAlicesRing fields
        message: p0.message,
        owningAddress: p0.owningAddress,
        ring: p0.ring,
        curve: p0.curve
      });
    };

    fetchData();
  }, []);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage({ ringSignature: null });
    sendMessageToBackground(message);
  }, [createMessage, sendMessageToBackground]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);

    try {
      // params & fields will be present because if not,
      // we won't be able to go to the confirm transaction state
      const ringSignature = sign(
        `0x${ownerPrivateKey}`,
        params.ring as string[],
        JSON.stringify(params.message),
        params.curve as string
      );

      setTransaction(TransactionStatus.Success);
      sendMessageToBackground(createMessage({ ringSignature: ringSignature }));
    } catch {
      setErrorRequestRejection(new Error('Error signing message'));
    }
  }, [createMessage, ownerPrivateKey, sendMessageToBackground]);

  if (transactionStatusComponent) {
    return <div>{transactionStatusComponent}</div>;
  }

  return (
    <TransactionPage
      title="Alice's Ring Signature"
      description="Please review the data below."
      approveButtonText="Sign"
      actionButtonsDescription="Only sign with a website you trust."
      onClickApprove={handleConfirm}
      onClickReject={handleReject}
    >
      <style>{`
          .react-json-view .string-value {
            white-space: pre-wrap; /* allow text to break onto the next line */
            word-break: break-all; /* break long strings */
          }
        `}</style>
      {
        <DataCard
          formattedData={
            <ReactJson
              src={params.message || {}}
              theme="summerfruit"
              name={null}
              enableClipboard={false}
              collapsed={false}
              shouldCollapse={false}
              onEdit={false}
              onAdd={false}
              onDelete={false}
              displayDataTypes={false}
              displayObjectSize={false}
              indentWidth={2}
            />
          }
          dataName="Message"
          isExpanded={isMessageExpanded}
          setIsExpanded={setIsMessageExpanded}
          paddingTop={10}
        />
      }
      <DataCard
        formattedData={params.owningAddress}
        dataName="Owning Address"
        isExpanded={isOwningAddressExpanded}
        setIsExpanded={setIsOwningAddressExpanded}
        paddingTop={10}
      />
      {
        <DataCard
          formattedData={
            <ReactJson
              src={params.ring || {}}
              theme="summerfruit"
              name={null}
              enableClipboard={false}
              collapsed={false}
              shouldCollapse={false}
              onEdit={false}
              onAdd={false}
              onDelete={false}
              displayDataTypes={false}
              displayObjectSize={false}
              indentWidth={2}
            />
          }
          dataName="Params"
          isExpanded={isParamsExpanded}
          setIsExpanded={setIsParamsExpanded}
          paddingTop={10}
        />
      }
    </TransactionPage>
  );
};

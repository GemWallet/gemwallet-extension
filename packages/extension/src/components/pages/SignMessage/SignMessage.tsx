import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import * as Sentry from '@sentry/react';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveSignMessageBackgroundMessage,
  ReceiveSignMessageBackgroundMessageDeprecated,
  ResponseType,
  SignMessageRequest
} from '@gemwallet/constants';

import { STORAGE_MESSAGING_KEY } from '../../../constants';
import {
  TransactionProgressStatus,
  useBrowser,
  useLedger,
  useTransactionProgress
} from '../../../contexts';
import { useFetchFromSessionStorage } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { serializeError } from '../../../utils/errors';
import { DataCard } from '../../molecules';
import { AsyncTransaction, TransactionPage } from '../../templates';

interface Params {
  message: string | null;
}

export const SignMessage: FC = () => {
  const { signMessage } = useLedger();
  const { window: extensionWindow, closeExtension } = useBrowser();
  const { setTransactionProgress } = useTransactionProgress();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [params, setParams] = useState<Params>({
    message: null
  });

  const payload = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const url = urlParams.get('url');
    const favicon = urlParams.get('favicon');

    return {
      id: Number(urlParams.get('id')) || 0,
      url,
      favicon: favicon || undefined
    };
  }, []);

  const { id, url, favicon } = payload;

  const receivingMessage = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('requestMessage') === 'REQUEST_SIGN_MESSAGE/V3'
      ? 'RECEIVE_SIGN_MESSAGE/V3'
      : 'RECEIVE_SIGN_MESSAGE';
  }, []);

  const urlParams = new URLSearchParams(window.location.search);
  const { fetchedData } = useFetchFromSessionStorage(
    urlParams.get(STORAGE_MESSAGING_KEY) ?? undefined
  ) as {
    fetchedData: SignMessageRequest | undefined;
  };

  useEffect(() => {
    if (!fetchedData) {
      return;
    }

    const message = 'message' in fetchedData ? fetchedData.message : undefined;

    if (!message) {
      setIsParamsMissing(true);
      return;
    }

    setParams({
      message
    });
  }, [fetchedData]);

  const handleSendMessage = useCallback(
    (messagePayload: { signedMessage: string | null | undefined; error?: Error }) => {
      const { signedMessage, error } = messagePayload;

      let message:
        | ReceiveSignMessageBackgroundMessage
        | ReceiveSignMessageBackgroundMessageDeprecated = {
        app: GEM_WALLET,
        type: 'RECEIVE_SIGN_MESSAGE',
        payload: {
          id,
          signedMessage: messagePayload.signedMessage
        }
      };

      if (receivingMessage === 'RECEIVE_SIGN_MESSAGE/V3') {
        message = {
          app: GEM_WALLET,
          type: receivingMessage,
          payload: {
            id,
            type: ResponseType.Response,
            result: signedMessage ? { signedMessage: signedMessage } : undefined,
            error: error ? serializeError(error) : undefined
          }
        };
      }

      chrome.runtime
        .sendMessage<
          ReceiveSignMessageBackgroundMessage | ReceiveSignMessageBackgroundMessageDeprecated
        >(message)
        .then(() => {
          if (extensionWindow?.id) {
            closeExtension({ windowId: Number(extensionWindow.id) });
          }
        })
        .catch((e) => {
          Sentry.captureException(e);
        })
        .finally(() => {
          setTransactionProgress(TransactionProgressStatus.IDLE);
        });
    },
    [closeExtension, extensionWindow?.id, id, receivingMessage, setTransactionProgress]
  );

  const handleReject = useCallback(() => {
    handleSendMessage({ signedMessage: null });
  }, [handleSendMessage]);

  const handleSign = useCallback(() => {
    try {
      // The message will be a string, otherwise the transaction would have been rejected already
      const signature = signMessage(params.message as string);
      handleSendMessage({ signedMessage: signature });
    } catch (e) {
      handleSendMessage({ signedMessage: undefined, error: e as Error });
    }
  }, [handleSendMessage, params.message, signMessage]);

  if (isParamsMissing) {
    chrome.runtime.sendMessage<
      ReceiveSignMessageBackgroundMessage | ReceiveSignMessageBackgroundMessageDeprecated
    >({
      app: GEM_WALLET,
      type: 'RECEIVE_SIGN_MESSAGE/V3',
      payload: {
        id,
        type: ResponseType.Response,
        error: serializeError(new Error(API_ERROR_BAD_REQUEST))
      }
    });
    setTransactionProgress(TransactionProgressStatus.IDLE);
    return (
      <AsyncTransaction
        title="Signature failed"
        subtitle={
          <>
            A message has not been provided to the extension
            <br />
            Please contact the developer of the website
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  return (
    <TransactionPage
      title="Sign Message"
      description="Signing this message will prove your ownership of the wallet."
      url={url}
      favicon={favicon}
      actionButtonsDescription="Only sign messages with a website you trust."
      onClickApprove={handleSign}
      onClickReject={handleReject}
    >
      <DataCard
        formattedData={params.message}
        dataName={'Message'}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
    </TransactionPage>
  );
};

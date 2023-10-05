import { FC, useCallback, useMemo, useState } from 'react';

import * as Sentry from '@sentry/react';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveSignMessageBackgroundMessage,
  ReceiveSignMessageBackgroundMessageDeprecated,
  ResponseType
} from '@gemwallet/constants';

import {
  TransactionProgressStatus,
  useBrowser,
  useLedger,
  useTransactionProgress
} from '../../../contexts';
import { TransactionStatus } from '../../../types';
import { serializeError } from '../../../utils/errors';
import { DataCard } from '../../molecules';
import { AsyncTransaction, TransactionPage } from '../../templates';

export const SignMessage: FC = () => {
  const { signMessage } = useLedger();
  const { window: extensionWindow, closeExtension } = useBrowser();
  const { setTransactionProgress } = useTransactionProgress();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const payload = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const url = urlParams.get('url');
    const favicon = urlParams.get('favicon');
    const message = urlParams.get('message');

    if (message === null) {
      setIsParamsMissing(true);
    }

    return {
      id: Number(urlParams.get('id')) || 0,
      url,
      favicon: favicon || undefined,
      message: message || ''
    };
  }, []);

  const receivingMessage = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('requestMessage') === 'REQUEST_SIGN_MESSAGE/V3'
      ? 'RECEIVE_SIGN_MESSAGE/V3'
      : 'RECEIVE_SIGN_MESSAGE';
  }, []);

  const { id, url, favicon, message } = payload;

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
      const signature = signMessage(message);
      handleSendMessage({ signedMessage: signature });
    } catch (e) {
      handleSendMessage({ signedMessage: undefined, error: e as Error });
    }
  }, [handleSendMessage, message, signMessage]);

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
      onClickApprove={handleSign}
      onClickReject={handleReject}
    >
      <DataCard
        formattedData={message}
        dataName={'Message'}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
    </TransactionPage>
  );
};

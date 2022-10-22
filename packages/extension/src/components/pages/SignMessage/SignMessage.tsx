import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';
import { Container, Typography, Button, Paper, Avatar, Divider } from '@mui/material';
import {
  GEM_WALLET,
  Message,
  ReceiveAddressBackgroundMessage,
  ReceiveSignMessageBackgroundMessage
} from '@gemwallet/constants';
import { PageWithTitle, AsyncTransaction } from '../../templates';
import { SECONDARY_GRAY } from '../../../constants';
import { useBrowser, useLedger } from '../../../contexts';
import { TransactionStatus } from '../../../types';

export const SignMessage: FC = () => {
  const { signMessage } = useLedger();
  const { window: extensionWindow, closeExtension } = useBrowser();
  const [isParamsMissing, setIsParamsMissing] = useState(false);

  useEffect(() => {
    if (isParamsMissing) {
      Sentry.captureMessage('Params are missing');
    }
  }, [isParamsMissing]);

  const payload = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const url = urlParams.get('url');
    const title = urlParams.get('title');
    const favicon = urlParams.get('favicon');
    const message = urlParams.get('message');

    if (message === null) {
      setIsParamsMissing(true);
    }

    return {
      id: Number(urlParams.get('id')) || 0,
      url,
      title,
      favicon: favicon || undefined,
      message: message || ''
    };
  }, []);

  const { id, url, title, favicon, message } = payload;

  const handleReject = useCallback(() => {
    chrome.runtime
      .sendMessage<ReceiveAddressBackgroundMessage>({
        app: GEM_WALLET,
        type: Message.ReceiveAddress,
        payload: {
          id,
          publicAddress: null
        }
      })
      .then(() => {
        if (extensionWindow?.id) {
          closeExtension({ windowId: Number(extensionWindow.id) });
        }
      });
  }, [closeExtension, extensionWindow?.id, id]);

  const handleSign = useCallback(() => {
    const signature = signMessage(message);
    chrome.runtime
      .sendMessage<ReceiveSignMessageBackgroundMessage>({
        app: GEM_WALLET,
        type: Message.ReceiveSignMessage,
        payload: {
          id,
          signedMessage: signature || null
        }
      })
      .then(() => {
        if (extensionWindow?.id) {
          closeExtension({ windowId: Number(extensionWindow.id) });
        }
      });
  }, [closeExtension, extensionWindow?.id, id, message, signMessage]);

  if (isParamsMissing) {
    return (
      <AsyncTransaction
        title="Signature failed"
        subtitle={
          <>
            A message has not be provided to the extension
            <br />
            Please contact the developer of the website
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  return (
    <PageWithTitle title="Sign Transaction">
      <Paper
        elevation={24}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px'
        }}
      >
        <Avatar src={favicon} variant="rounded" />
        <Typography variant="h6">{title}</Typography>
        <Typography style={{ color: SECONDARY_GRAY }}>{url}</Typography>
      </Paper>

      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">You are signing:</Typography>
        <Divider style={{ margin: '10px 0' }} />
        <div style={{ overflowY: 'scroll', height: '200px' }}>
          <Typography variant="body2" style={{ color: SECONDARY_GRAY }}>
            {message}
          </Typography>
        </div>
      </Paper>

      <div style={{ display: 'flex', justifyContent: 'center', color: SECONDARY_GRAY }}>
        <Typography>Only sign messages with a website you trust</Typography>
      </div>

      <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button variant="contained" color="secondary" onClick={handleReject}>
          Reject
        </Button>
        <Button variant="contained" onClick={handleSign}>
          Sign
        </Button>
      </Container>
    </PageWithTitle>
  );
};

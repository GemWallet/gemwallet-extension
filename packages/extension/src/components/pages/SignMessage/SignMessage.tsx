import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';
import { Container, Typography, Button, Paper, Avatar, Divider } from '@mui/material';
import { GEM_WALLET, Message } from '@gemwallet/api/src';
import { PageWithTitle } from '../../templates';
import { Transaction as TransactionOrganism } from '../../organisms/Transaction';
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
      .sendMessage({
        app: GEM_WALLET,
        type: Message.ReceivePublicAddress,
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
      .sendMessage({
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
      <PageWithTitle title="">
        <TransactionOrganism
          transaction={TransactionStatus.Rejected}
          failureReason="A message has not be provided to the extension"
        />
      </PageWithTitle>
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
            I am going to do it. I have made up my mind. These are the first few words of the new…
            the best … the Longest Text In The Entire History Of The Known Universe! This Has To
            Have Over 35,000 words the beat the current world record set by that person who made
            that flaming chicken handbooky thingy. I might just be saying random things the whole
            time I type in this so you might get confused a lot. I just discovered something
            terrible. autocorrect is on!! no!!! this has to be crazy, so I will have to break all
            the English language rules and the basic knowledge of the average human being. I am not
            an average human being, however I am special. no no no, not THAT kind of special ;). Why
            do
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

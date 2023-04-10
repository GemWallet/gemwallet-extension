import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Container, Typography, Button, Paper, Avatar, Divider } from '@mui/material';
import * as Sentry from '@sentry/react';
import { useTranslation } from 'react-i18next';

import { GEM_WALLET, ReceiveSignMessageBackgroundMessage } from '@gemwallet/constants';

import { SECONDARY_GRAY } from '../../../constants';
import { useBrowser, useLedger } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import { PageWithTitle, AsyncTransaction } from '../../templates';

export const SignMessage: FC = () => {
  const { signMessage } = useLedger();
  const { window: extensionWindow, closeExtension } = useBrowser();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const { t } = useTranslation('common');

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
      .sendMessage<ReceiveSignMessageBackgroundMessage>({
        app: GEM_WALLET,
        type: 'RECEIVE_SIGN_MESSAGE',
        payload: {
          id,
          signedMessage: null
        }
      })
      .then(() => {
        if (extensionWindow?.id) {
          closeExtension({ windowId: Number(extensionWindow.id) });
        }
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  }, [closeExtension, extensionWindow?.id, id]);

  const handleSign = useCallback(() => {
    const signature = signMessage(message);
    chrome.runtime
      .sendMessage<ReceiveSignMessageBackgroundMessage>({
        app: GEM_WALLET,
        type: 'RECEIVE_SIGN_MESSAGE',
        payload: {
          id,
          signedMessage: signature
        }
      })
      .then(() => {
        if (extensionWindow?.id) {
          closeExtension({ windowId: Number(extensionWindow.id) });
        }
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  }, [closeExtension, extensionWindow?.id, id, message, signMessage]);

  if (isParamsMissing) {
    return (
      <AsyncTransaction
        title={t('TEXT_SIGN_FAILED')}
        subtitle={
          <>
            {t('TEXT_SIGN_FAILED_DETAILS_1')}
            <br />
            {t('TEXT_SIGN_FAILED_DETAILS_2')}
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  return (
    <PageWithTitle title={t('TEXT_SIGN_MESSAGE')}>
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
        <Typography variant="body1">{t('TEXT_YOU_ARE_SIGNING')}:</Typography>
        <Divider style={{ margin: '10px 0' }} />
        <div style={{ overflowY: 'scroll', height: '200px' }}>
          <Typography variant="body2" style={{ color: SECONDARY_GRAY }}>
            {message}
          </Typography>
        </div>
      </Paper>

      <div style={{ display: 'flex', justifyContent: 'center', color: SECONDARY_GRAY }}>
        <Typography>{t('TEXT_SIGN_DISCLAIMER')}</Typography>
      </div>

      <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button variant="contained" color="secondary" onClick={handleReject}>
          {t('TEXT_REJECT')}
        </Button>
        <Button variant="contained" onClick={handleSign}>
          {t('TEXT_SIGN')}
        </Button>
      </Container>
    </PageWithTitle>
  );
};

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar, Button, Container, Grid, IconButton, Paper, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveSignMessageBackgroundMessage,
  ReceiveSignMessageBackgroundMessageDeprecated,
  ResponseType
} from '@gemwallet/constants';

import { NETWORK_BANNER_HEIGHT, SECONDARY_GRAY } from '../../../constants';
import {
  TransactionProgressStatus,
  useBrowser,
  useLedger,
  useNetwork,
  useTransactionProgress
} from '../../../contexts';
import { TransactionStatus } from '../../../types';
import { serializeError } from '../../../utils/errors';
import { AsyncTransaction } from '../../templates';

const BUTTONS_SIZE = '150px';

export const SignMessage: FC = () => {
  const { signMessage } = useLedger();
  const { window: extensionWindow, closeExtension } = useBrowser();
  const { hasOfflineBanner } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const messageBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageBoxRef.current && messageBoxRef.current.offsetHeight > 120) {
      setIsExpandable(true);
    } else {
      setIsExpandable(false);
    }
  }, []);

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
    <>
      <Container
        component="main"
        style={{
          ...(hasOfflineBanner ? { position: 'fixed', top: NETWORK_BANNER_HEIGHT } : {}),
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '24px',
          paddingLeft: '18px',
          paddingRight: '18px',
          overflowY: 'auto',
          height: 'auto',
          paddingBottom: '100px',
          backgroundColor: '#121212',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={favicon} sx={{ bgcolor: '#2b2b2b', padding: '6px' }} variant="rounded" />
          <div style={{ marginLeft: '10px' }}>
            <Typography
              variant="h6"
              component="h1"
              style={{ fontSize: '1.5rem', lineHeight: '1.2' }}
              data-testid="page-title"
            >
              Sign Message
            </Typography>
            <Typography
              component="h2"
              style={{
                color: SECONDARY_GRAY,
                fontSize: '0.9rem',
                overflow: 'hidden'
              }}
            >
              {url}
            </Typography>
          </div>
        </div>
        <Typography style={{ color: SECONDARY_GRAY, marginTop: '20px' }}>
          Signing this message will prove your ownership of the wallet.
        </Typography>
        <Paper
          elevation={24}
          style={{
            padding: '15px',
            marginTop: '30px',
            borderRadius: '15px',
            backgroundColor: '#000000'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: isExpandable ? '-12px' : '0'
            }}
          >
            {isExpandable ? (
              <IconButton onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? (
                  <ExpandMoreIcon style={{ fontSize: '20px' }} />
                ) : (
                  <ChevronRightIcon style={{ fontSize: '20px' }} />
                )}
              </IconButton>
            ) : null}
            <Typography variant="body1">Message</Typography>
          </div>
          <div
            ref={messageBoxRef}
            style={{
              position: 'relative',
              overflowY: 'auto',
              maxHeight: isExpanded ? 'none' : '120px',
              borderRadius: '10px',
              paddingBottom: '4px'
            }}
          >
            <Typography
              variant="body2"
              style={{
                color: SECONDARY_GRAY,
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                borderRadius: '10px',
                marginTop: '8px'
              }}
            >
              {message}
            </Typography>
            {!isExpanded && isExpandable ? (
              <div
                style={{
                  content: '',
                  display: 'block',
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  height: '20px',
                  backgroundImage: 'linear-gradient(to top, rgba(40, 40, 40), rgba(0, 0, 0, 0))'
                }}
              />
            ) : null}
          </div>
        </Paper>
      </Container>
      <div
        style={{
          backgroundColor: '#272727',
          position: 'fixed',
          width: '100%',
          bottom: 0,
          paddingTop: '10px',
          paddingBottom: '10px',
          boxShadow: '0 -2px 15px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            color: SECONDARY_GRAY,
            paddingBottom: '10px'
          }}
        >
          <Typography variant="body2" align="center">
            Only sign messages with a website you trust.
          </Typography>
        </div>
        <Container>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleReject}
                style={{ minWidth: BUTTONS_SIZE }}
              >
                Reject
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleSign} style={{ minWidth: BUTTONS_SIZE }}>
                Sign
              </Button>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
};

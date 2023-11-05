import { FC, useEffect } from 'react';

import { CircularProgress, Container, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { useLocation } from 'react-router-dom';

import {
  GEM_WALLET,
  GetNetworkResponse,
  GetNetworkResponseDeprecated,
  InternalReceivePasswordContentMessage,
  MSG_INTERNAL_RECEIVE_PASSWORD,
  MSG_INTERNAL_REQUEST_PASSWORD,
  NETWORK,
  ReceiveGetNetworkBackgroundMessage,
  ReceiveGetNetworkBackgroundMessageDeprecated,
  ResponseType
} from '@gemwallet/constants';

import { Logo } from './components/atoms';
import { AppRoutes } from './components/pages/routes';
import { ErrorBoundary } from './components/templates';
import { PARAMETER_SHARE_NETWORK } from './constants';
import { useBrowser, useNetwork, useWallet } from './contexts';
import { loadNetwork } from './utils';

const App: FC = () => {
  const { window: extensionWindow, closeExtension } = useBrowser();
  const { search } = useLocation();
  const { signIn } = useWallet();
  const { client, chainName } = useNetwork();

  useEffect(() => {
    // Action which doesn't require to be authenticated
    if (search.includes(PARAMETER_SHARE_NETWORK)) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const type =
        urlParams.get('requestMessage') === 'REQUEST_GET_NETWORK/V3'
          ? 'RECEIVE_GET_NETWORK/V3'
          : 'RECEIVE_NETWORK';

      const id = Number(urlParams.get('id')) || 0;
      const network = loadNetwork();
      const networkResponse = Object.values(NETWORK[chainName])
        .map((n) => n.name.toLowerCase())
        .includes(network.name.toLowerCase())
        ? network.name
        : NETWORK[chainName].Custom.name;

      if (extensionWindow) {
        let message:
          | ReceiveGetNetworkBackgroundMessage
          | ReceiveGetNetworkBackgroundMessageDeprecated;

        if (type === 'RECEIVE_GET_NETWORK/V3') {
          const response: GetNetworkResponse = {
            type: ResponseType.Response,
            result: {
              network: networkResponse,
              websocket: network.server
            }
          };

          message = {
            app: GEM_WALLET,
            type,
            payload: { id, ...response }
          };
        } else {
          const response: GetNetworkResponseDeprecated = {
            network: networkResponse
          };

          message = {
            app: GEM_WALLET,
            type,
            payload: { id, ...response }
          };
        }

        chrome.runtime
          .sendMessage<
            ReceiveGetNetworkBackgroundMessage | ReceiveGetNetworkBackgroundMessageDeprecated
          >(message)
          .then(() => {
            closeExtension({ windowId: Number(extensionWindow.id) });
          })
          .catch((e) => {
            Sentry.captureException(e);
          });
      }
    }
  }, [chainName, closeExtension, extensionWindow, search]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      chrome.runtime
        .sendMessage({
          app: GEM_WALLET,
          type: MSG_INTERNAL_REQUEST_PASSWORD
        })
        .catch((e) => {
          Sentry.captureException(e);
        });
    }
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const messageListener = (message: any, sender: chrome.runtime.MessageSender) => {
        if (message.app !== GEM_WALLET || sender.id !== chrome.runtime.id) {
          return; // exit early if the message is not from gem-wallet or the sender is not the extension itself
        }

        if (
          message.type === MSG_INTERNAL_RECEIVE_PASSWORD &&
          (message as InternalReceivePasswordContentMessage).payload.password
        ) {
          signIn((message as InternalReceivePasswordContentMessage).payload.password);
        }
      };

      chrome.runtime.onMessage.addListener(messageListener);

      return () => {
        chrome.runtime.onMessage.removeListener(messageListener);
      };
    }
  }, [signIn]);

  if (client === undefined) {
    return (
      <Container
        component="main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          padding: '30px 16px'
        }}
      >
        <Container style={{ textAlign: 'center', marginTop: '30%' }}>
          <Logo isAnimated style={{ transform: 'scale(2)' }} />
          <Typography variant="h4" component="h1" style={{ marginTop: '30px' }}>
            GemWallet
          </Typography>
          <Typography variant="h6" component="h2" style={{ marginTop: '30px' }}>
            Your gateway to the XRPL
          </Typography>
          <CircularProgress size={50} style={{ marginTop: '60px' }} />
        </Container>
      </Container>
    );
  }

  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
};

export default App;

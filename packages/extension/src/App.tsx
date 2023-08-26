import { FC, useCallback, useEffect } from 'react';

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
  Network,
  ReceiveGetNetworkBackgroundMessage,
  ReceiveGetNetworkBackgroundMessageDeprecated,
  ResponseType
} from '@gemwallet/constants';

import { Logo } from './components/atoms';
import { AppRoutes } from './components/pages/routes';
import { ErrorBoundary } from './components/templates';
import {
  PARAMETER_SHARE_ADDRESS,
  PARAMETER_SHARE_NETWORK,
  PARAMETER_SHARE_NFT,
  PARAMETER_SHARE_PUBLIC_KEY,
  PARAMETER_SIGN_MESSAGE,
  PARAMETER_SIGN_TRANSACTION,
  PARAMETER_SUBMIT_TRANSACTION,
  PARAMETER_SUBMIT_TRANSACTIONS_BULK,
  PARAMETER_TRANSACTION_ACCEPT_NFT_OFFER,
  PARAMETER_TRANSACTION_BURN_NFT,
  PARAMETER_TRANSACTION_CANCEL_NFT_OFFER,
  PARAMETER_TRANSACTION_CANCEL_OFFER,
  PARAMETER_TRANSACTION_CREATE_NFT_OFFER,
  PARAMETER_TRANSACTION_CREATE_OFFER,
  PARAMETER_TRANSACTION_MINT_NFT,
  PARAMETER_TRANSACTION_PAYMENT,
  PARAMETER_TRANSACTION_SET_ACCOUNT,
  PARAMETER_TRANSACTION_TRUSTLINE
} from './constants';
import { useBrowser, useNetwork, useWallet } from './contexts';
import { useBeforeUnload } from './hooks';
import { loadFromChromeSessionStorage, loadNetwork } from './utils';

const App: FC = () => {
  const { window: extensionWindow, closeExtension } = useBrowser();
  const { search } = useLocation();
  const { signIn } = useWallet();
  const { client } = useNetwork();

  const handleTransaction = useCallback(
    (payload: unknown) => {
      if (process.env.NODE_ENV === 'production') {
        chrome.runtime
          .sendMessage(chrome.runtime.id, payload)
          .then(() => {
            if (extensionWindow?.id) {
              closeExtension({ windowId: Number(extensionWindow.id) });
            }
          })
          .catch((e) => {
            Sentry.captureException(e);
          });
      }
    },
    [closeExtension, extensionWindow?.id]
  );

  useBeforeUnload(async () => {
    // Only sends reject message if there is a transaction in progress, which means the user has not confirmed the
    // transaction but has closed the extension
    const hasTxInProgress = await loadFromChromeSessionStorage('hasTxInProgress', true);
    if (hasTxInProgress) {
      const urlParams = new URLSearchParams(window.location.search);
      const windowId = Number(urlParams.get('id'));
      const defaultPayload = {
        id: windowId,
        result: null
      };
      if (extensionWindow?.id && windowId) {
        if (search.includes(PARAMETER_TRANSACTION_PAYMENT)) {
          const urlParams = new URLSearchParams(window.location.search);
          const type =
            urlParams.get('requestMessage') === 'REQUEST_SEND_PAYMENT/V3'
              ? 'RECEIVE_SEND_PAYMENT/V3'
              : 'RECEIVE_PAYMENT_HASH';
          handleTransaction({
            app: GEM_WALLET,
            type,
            payload:
              type === 'RECEIVE_SEND_PAYMENT/V3'
                ? defaultPayload
                : {
                    id: windowId,
                    hash: null
                  }
          });
        } else if (search.includes(PARAMETER_SHARE_ADDRESS)) {
          const urlParams = new URLSearchParams(window.location.search);
          const type =
            urlParams.get('requestMessage') === 'REQUEST_GET_ADDRESS/V3'
              ? 'RECEIVE_GET_ADDRESS/V3'
              : 'RECEIVE_ADDRESS';
          handleTransaction({
            app: GEM_WALLET,
            type,
            payload:
              type === 'RECEIVE_GET_ADDRESS/V3'
                ? defaultPayload
                : {
                    id: windowId,
                    publicAddress: null
                  }
          });
        } else if (search.includes(PARAMETER_SHARE_PUBLIC_KEY)) {
          const urlParams = new URLSearchParams(window.location.search);
          const type =
            urlParams.get('requestMessage') === 'REQUEST_GET_PUBLIC_KEY/V3'
              ? 'RECEIVE_GET_PUBLIC_KEY/V3'
              : 'RECEIVE_PUBLIC_KEY';
          handleTransaction({
            app: GEM_WALLET,
            type,
            payload:
              type === 'RECEIVE_GET_PUBLIC_KEY/V3'
                ? defaultPayload
                : {
                    id: windowId,
                    address: null,
                    publicKey: null
                  }
          });
        } else if (search.includes(PARAMETER_SIGN_MESSAGE)) {
          const urlParams = new URLSearchParams(window.location.search);
          const type =
            urlParams.get('requestMessage') === 'REQUEST_SIGN_MESSAGE/V3'
              ? 'RECEIVE_SIGN_MESSAGE/V3'
              : 'RECEIVE_SIGN_MESSAGE';
          handleTransaction({
            app: GEM_WALLET,
            type,
            payload:
              type === 'RECEIVE_SIGN_MESSAGE/V3'
                ? defaultPayload
                : {
                    id: windowId,
                    signedMessage: null
                  }
          });
        } else if (search.includes(PARAMETER_SUBMIT_TRANSACTION)) {
          handleTransaction({
            app: GEM_WALLET,
            type: 'RECEIVE_SUBMIT_TRANSACTION/V3',
            payload: defaultPayload
          });
        } else if (search.includes(PARAMETER_SIGN_TRANSACTION)) {
        handleTransaction({
          app: GEM_WALLET,
          type: 'RECEIVE_SIGN_TRANSACTION/V3',
          payload: defaultPayload
        });
      } else if (search.includes(PARAMETER_SUBMIT_TRANSACTIONS_BULK)) {
        handleTransaction({
          app: GEM_WALLET,
          type: 'RECEIVE_SUBMIT_BULK_TRANSACTIONS/V3',
          payload: defaultPayload
        });
      } else if (search.includes(PARAMETER_TRANSACTION_TRUSTLINE)) {
          const urlParams = new URLSearchParams(window.location.search);
          const type =
            urlParams.get('requestMessage') === 'REQUEST_SET_TRUSTLINE/V3'
              ? 'RECEIVE_SET_TRUSTLINE/V3'
              : 'RECEIVE_TRUSTLINE_HASH';
          handleTransaction({
            app: GEM_WALLET,
            type,
            payload:
              type === 'RECEIVE_SET_TRUSTLINE/V3'
                ? defaultPayload
                : {
                    id: windowId,
                    hash: null
                  }
          });
        } else if (search.includes(PARAMETER_SHARE_NFT)) {
          const urlParams = new URLSearchParams(window.location.search);
          const type =
            urlParams.get('requestMessage') === 'REQUEST_GET_NFT/V3'
              ? 'RECEIVE_GET_NFT/V3'
              : 'RECEIVE_NFT';
          handleTransaction({
            app: GEM_WALLET,
            type,
            payload:
              type === 'RECEIVE_GET_NFT/V3'
                ? defaultPayload
                : {
                    id: windowId,
                    nfts: null
                  }
          });
        } else if (search.includes(PARAMETER_TRANSACTION_MINT_NFT)) {
          handleTransaction({
            app: GEM_WALLET,
            type: 'RECEIVE_MINT_NFT/V3',
            payload: defaultPayload
          });
        } else if (search.includes(PARAMETER_TRANSACTION_CREATE_NFT_OFFER)) {
          handleTransaction({
            app: GEM_WALLET,
            type: 'RECEIVE_CREATE_NFT_OFFER/V3',
            payload: defaultPayload
          });
        } else if (search.includes(PARAMETER_TRANSACTION_CANCEL_NFT_OFFER)) {
          handleTransaction({
            app: GEM_WALLET,
            type: 'RECEIVE_CANCEL_NFT_OFFER/V3',
            payload: defaultPayload
          });
        } else if (search.includes(PARAMETER_TRANSACTION_ACCEPT_NFT_OFFER)) {
          handleTransaction({
            app: GEM_WALLET,
            type: 'RECEIVE_ACCEPT_NFT_OFFER/V3',
            payload: defaultPayload
          });
        } else if (search.includes(PARAMETER_TRANSACTION_BURN_NFT)) {
          handleTransaction({
            app: GEM_WALLET,
            type: 'RECEIVE_BURN_NFT/V3',
            payload: defaultPayload
          });
        } else if (search.includes(PARAMETER_TRANSACTION_SET_ACCOUNT)) {
          handleTransaction({
            app: GEM_WALLET,
            type: 'RECEIVE_SET_ACCOUNT/V3',
            payload: defaultPayload
          });
        } else if (search.includes(PARAMETER_TRANSACTION_CREATE_OFFER)) {
          handleTransaction({
            app: GEM_WALLET,
            type: 'RECEIVE_CREATE_OFFER/V3',
            payload: defaultPayload
          });
        } else if (search.includes(PARAMETER_TRANSACTION_CANCEL_OFFER)) {
          handleTransaction({
            app: GEM_WALLET,
            type: 'RECEIVE_CANCEL_OFFER/V3',
            payload: defaultPayload
          });
        }
      }
    }
  });

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
      const networkResponse = Object.values(NETWORK)
        .map((n) => n.name.toLowerCase())
        .includes(network.name.toLowerCase())
        ? network.name
        : Network.CUSTOM;

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
  }, [closeExtension, extensionWindow, search]);

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

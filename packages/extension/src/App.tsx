import { FC, useCallback, useEffect } from 'react';

import * as Sentry from '@sentry/react';
import { Route, Routes, useLocation } from 'react-router-dom';

import {
  GEM_WALLET,
  GetNetworkResponse,
  GetNetworkResponseDeprecated,
  ReceiveGetNetworkBackgroundMessage,
  ReceiveGetNetworkBackgroundMessageDeprecated,
  ResponseType
} from '@gemwallet/constants';

import { PrivateRoute } from './components/atoms/PrivateRoute';
import {
  About,
  AcceptNFTOffer,
  AddNewTrustline,
  AddNewWallet,
  CancelNFTOffer,
  CreateNFTOffer,
  CreateWallet,
  EditWallet,
  History,
  Home,
  ImportMnemonic,
  ImportSecretNumbers,
  ImportSeed,
  ImportWallet,
  ListWallets,
  Login,
  MintNFT,
  ResetPassword,
  SendPayment,
  Settings,
  ShareAddress,
  ShareNFT,
  SharePublicKey,
  SignMessage,
  Transaction,
  TrustedApps,
  Welcome
} from './components/pages';
import { ErrorBoundary } from './components/templates';
import {
  ABOUT_PATH,
  ACCEPT_NFT_OFFER_PATH,
  ADD_NEW_TRUSTLINE_PATH,
  ADD_NEW_WALLET_PATH,
  CANCEL_NFT_OFFER_PATH,
  CREATE_NEW_WALLET_PATH,
  CREATE_NFT_OFFER_PATH,
  EDIT_WALLET_PATH,
  HISTORY_PATH,
  HOME_PATH,
  IMPORT_MNEMONIC_PATH,
  IMPORT_SECRET_NUMBERS_PATH,
  IMPORT_SEED_PATH,
  IMPORT_WALLET_PATH,
  LIST_WALLETS_PATH,
  MINT_NFT_PATH,
  PARAMETER_SHARE_ADDRESS,
  PARAMETER_SHARE_NETWORK,
  PARAMETER_SHARE_NFT,
  PARAMETER_SHARE_PUBLIC_KEY,
  PARAMETER_SIGN_MESSAGE,
  PARAMETER_TRANSACTION_ACCEPT_NFT_OFFER,
  PARAMETER_TRANSACTION_CANCEL_NFT_OFFER,
  PARAMETER_TRANSACTION_CREATE_NFT_OFFER,
  PARAMETER_TRANSACTION_MINT_NFT,
  PARAMETER_TRANSACTION_PAYMENT,
  PARAMETER_TRANSACTION_TRUSTLINE,
  RESET_PASSWORD_PATH,
  SEND_PATH,
  SETTINGS_PATH,
  SHARE_NFT_PATH,
  SHARE_PUBLIC_ADDRESS_PATH,
  SHARE_PUBLIC_KEY_PATH,
  SIGN_MESSAGE_PATH,
  TRANSACTION_PATH,
  TRUSTED_APPS_PATH,
  WELCOME_PATH
} from './constants';
import { useBrowser } from './contexts';
import { useBeforeUnload } from './hooks';
import { loadNetwork } from './utils';

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const App: FC = () => {
  const { window: extensionWindow, closeExtension } = useBrowser();
  const { search } = useLocation();

  const handleTransaction = useCallback(
    (payload: unknown) => {
      chrome.runtime
        .sendMessage(payload)
        .then(() => {
          if (extensionWindow?.id) {
            closeExtension({ windowId: Number(extensionWindow.id) });
          }
        })
        .catch((e) => {
          Sentry.captureException(e);
        });
    },
    [closeExtension, extensionWindow?.id]
  );

  useBeforeUnload(() => {
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
      const network = loadNetwork().name;

      if (extensionWindow) {
        let message:
          | ReceiveGetNetworkBackgroundMessage
          | ReceiveGetNetworkBackgroundMessageDeprecated;

        if (type === 'RECEIVE_GET_NETWORK/V3') {
          const response: GetNetworkResponse = {
            type: ResponseType.Response,
            result: { network }
          };

          message = {
            app: GEM_WALLET,
            type,
            payload: { id, ...response }
          };
        } else {
          const response: GetNetworkResponseDeprecated = { network };

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

  return (
    <ErrorBoundary>
      <SentryRoutes>
        <Route path="*" element={<Login />} />
        <Route path={WELCOME_PATH} element={<Welcome />} />
        <Route path={IMPORT_MNEMONIC_PATH} element={<ImportMnemonic />} />
        <Route path={IMPORT_SECRET_NUMBERS_PATH} element={<ImportSecretNumbers />} />
        <Route path={IMPORT_SEED_PATH} element={<ImportSeed />} />
        <Route path={IMPORT_WALLET_PATH} element={<ImportWallet />} />
        <Route path={CREATE_NEW_WALLET_PATH} element={<CreateWallet />} />
        <Route
          path={HOME_PATH}
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path={LIST_WALLETS_PATH}
          element={
            <PrivateRoute>
              <ListWallets />
            </PrivateRoute>
          }
        />
        <Route
          path={`${EDIT_WALLET_PATH}/:publicAddress`}
          element={
            <PrivateRoute>
              <EditWallet />
            </PrivateRoute>
          }
        />
        <Route
          path={ADD_NEW_WALLET_PATH}
          element={
            <PrivateRoute>
              <AddNewWallet />
            </PrivateRoute>
          }
        />
        <Route
          path={ADD_NEW_TRUSTLINE_PATH}
          element={
            <PrivateRoute>
              <AddNewTrustline />
            </PrivateRoute>
          }
        />
        <Route
          path={TRANSACTION_PATH}
          element={
            <PrivateRoute>
              <Transaction />
            </PrivateRoute>
          }
        />
        <Route
          path={HISTORY_PATH}
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />
        <Route
          path={SEND_PATH}
          element={
            <PrivateRoute>
              <SendPayment />
            </PrivateRoute>
          }
        />
        <Route
          path={SETTINGS_PATH}
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path={SIGN_MESSAGE_PATH}
          element={
            <PrivateRoute>
              <SignMessage />
            </PrivateRoute>
          }
        />
        <Route
          path={SHARE_NFT_PATH}
          element={
            <PrivateRoute>
              <ShareNFT />
            </PrivateRoute>
          }
        />
        <Route
          path={SHARE_PUBLIC_ADDRESS_PATH}
          element={
            <PrivateRoute>
              <ShareAddress />
            </PrivateRoute>
          }
        />
        <Route
          path={SHARE_PUBLIC_KEY_PATH}
          element={
            <PrivateRoute>
              <SharePublicKey />
            </PrivateRoute>
          }
        />
        <Route
          path={MINT_NFT_PATH}
          element={
            <PrivateRoute>
              <MintNFT />
            </PrivateRoute>
          }
        />
        <Route
          path={CREATE_NFT_OFFER_PATH}
          element={
            <PrivateRoute>
              <CreateNFTOffer />
            </PrivateRoute>
          }
        />
        <Route
          path={CANCEL_NFT_OFFER_PATH}
          element={
            <PrivateRoute>
              <CancelNFTOffer />
            </PrivateRoute>
          }
        />
        <Route
          path={ACCEPT_NFT_OFFER_PATH}
          element={
            <PrivateRoute>
              <AcceptNFTOffer />
            </PrivateRoute>
          }
        />
        <Route
          path={ABOUT_PATH}
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          }
        />
        <Route path={RESET_PASSWORD_PATH} element={<ResetPassword />} />
        <Route
          path={TRUSTED_APPS_PATH}
          element={
            <PrivateRoute>
              <TrustedApps />
            </PrivateRoute>
          }
        />
      </SentryRoutes>
    </ErrorBoundary>
  );
};

export default App;

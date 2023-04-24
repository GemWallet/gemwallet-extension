import { FC, useEffect } from 'react';

import * as Sentry from '@sentry/react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { GEM_WALLET, ReceiveNetworkBackgroundMessage } from '@gemwallet/constants';

import { PrivateRoute } from './components/atoms/PrivateRoute';
import {
  About,
  AddNewTrustline,
  AddNewWallet,
  CreateWallet,
  EditWallet,
  Home,
  ImportMnemonic,
  ImportSecretNumbers,
  ImportSeed,
  ImportWallet,
  ListWallets,
  Login,
  ResetPassword,
  History,
  Settings,
  ShareAddress,
  ShareNFT,
  SharePublicKey,
  SignMessage,
  Transaction,
  TrustedApps,
  Welcome,
  SendPayment
} from './components/pages';
import { ErrorBoundary } from './components/templates';
import {
  ABOUT_PATH,
  CREATE_NEW_WALLET_PATH,
  HOME_PATH,
  IMPORT_SEED_PATH,
  PARAMETER_NETWORK,
  IMPORT_WALLET_PATH,
  RESET_PASSWORD_PATH,
  SETTINGS_PATH,
  SHARE_PUBLIC_ADDRESS_PATH,
  SHARE_PUBLIC_KEY_PATH,
  SIGN_MESSAGE_PATH,
  TRANSACTION_PATH,
  TRUSTED_APPS_PATH,
  WELCOME_PATH,
  IMPORT_MNEMONIC_PATH,
  IMPORT_SECRET_NUMBERS_PATH,
  LIST_WALLETS_PATH,
  ADD_NEW_WALLET_PATH,
  EDIT_WALLET_PATH,
  ADD_NEW_TRUSTLINE_PATH,
  HISTORY_PATH,
  SHARE_NFT_PATH,
  SEND_PATH,
} from './constants';
import { useBrowser } from './contexts';
import { loadNetwork } from './utils';

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const App: FC = () => {
  const { window: extensionWindow, closeExtension } = useBrowser();
  const { search } = useLocation();

  useEffect(() => {
    // Action which doesn't require to be authenticated
    if (search.includes(PARAMETER_NETWORK)) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      if (extensionWindow) {
        chrome.runtime
          .sendMessage<ReceiveNetworkBackgroundMessage>({
            app: GEM_WALLET,
            type: 'RECEIVE_NETWORK',
            payload: {
              id: Number(urlParams.get('id')) || 0,
              network: loadNetwork().name
            }
          })
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

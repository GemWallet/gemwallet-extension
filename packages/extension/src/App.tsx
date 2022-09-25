import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { PrivateRoute } from './components/atoms/PrivateRoute';
import {
  About,
  CreateWallet,
  Home,
  ImportSeed,
  Login,
  ResetPassword,
  Settings,
  ShareAddress,
  SharePublicKey,
  SignMessage,
  Transaction,
  TrustedApps,
  Welcome
} from './components/pages';
import { ErrorBoundary } from './components/templates';
import {
  ABOUT_PATH,
  CREATE_NEW_WALLET_PATH,
  HOME_PATH,
  IMPORT_SEED_PATH,
  RESET_PASSWORD_PATH,
  SETTINGS_PATH,
  SHARE_PUBLIC_ADDRESS_PATH,
  SHARE_PUBLIC_KEY_PATH,
  SIGN_MESSAGE_PATH,
  TRANSACTION_PATH,
  TRUSTED_APPS_PATH,
  WELCOME_PATH
} from './constants';

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const App: FC = () => {
  return (
    <ErrorBoundary>
      <SentryRoutes>
        <Route path="*" element={<Login />} />
        <Route path={WELCOME_PATH} element={<Welcome />} />
        <Route path={IMPORT_SEED_PATH} element={<ImportSeed />} />
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
          path={TRANSACTION_PATH}
          element={
            <PrivateRoute>
              <Transaction />
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

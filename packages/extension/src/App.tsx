import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './components/atoms/PrivateRoute';
import {
  About,
  CreateWallet,
  Home,
  ImportSeed,
  Login,
  ResetPassword,
  Settings,
  Transaction,
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
  TRANSACTION_PATH,
  WELCOME_PATH
} from './constants/routes';

const App: FC = () => {
  return (
    <ErrorBoundary>
      <Routes>
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
        /
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
          path={ABOUT_PATH}
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          }
        />
        <Route path={RESET_PASSWORD_PATH} element={<ResetPassword />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;

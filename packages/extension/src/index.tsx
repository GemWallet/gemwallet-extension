import React, { useMemo } from 'react';

import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserTracing, Replay } from '@sentry/browser';
import * as Sentry from '@sentry/react';
import {
  BrowserRouter,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes
} from 'react-router-dom';

import App from './App';
import { POPUP_HEIGHT, POPUP_WIDTH } from './constants';
import {
  BrowserProvider,
  LedgerProvider,
  NavBarPositionProvider,
  NetworkProvider,
  QueryProvider,
  ServerProvider,
  TransactionProgressProvider,
  WalletProvider
} from './contexts';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { createRoot } from 'react-dom/client';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: 'gemwallet-extension@' + process.env.REACT_APP_VERSION,
  environment: process.env.NODE_ENV,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      )
    }),
    new Replay()
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  sampleRate: process.env.NODE_ENV === 'development' ? 0.0 : 1.0,
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 0.0 : 1.0,
  replaysOnErrorSampleRate: process.env.NODE_ENV === 'development' ? 0.0 : 1.0
});

const GemWallet = () => {
  const theme = useMemo(
    () =>
      createTheme({
        ...{
          palette: {
            mode: 'dark'
          },
          components: {
            MuiBottomNavigation: {
              styleOverrides: {
                root: {
                  backgroundColor: 'transparent',
                  borderTop: 'solid 1px #bcbcbc'
                }
              }
            },
            MuiBottomNavigationAction: {
              styleOverrides: {
                root: {
                  '&.Mui-selected': {
                    color: '#ffffff'
                  }
                }
              }
            }
          }
        }
      }),
    []
  );

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Paper style={{ height: POPUP_HEIGHT - 20, width: POPUP_WIDTH }}>
          <QueryProvider>
            <BrowserRouter>
              <BrowserProvider>
                <WalletProvider>
                  <NetworkProvider>
                    <LedgerProvider>
                      <ServerProvider>
                        <TransactionProgressProvider>
                          <NavBarPositionProvider>
                            <App />
                          </NavBarPositionProvider>
                        </TransactionProgressProvider>
                      </ServerProvider>
                    </LedgerProvider>
                  </NetworkProvider>
                </WalletProvider>
              </BrowserProvider>
            </BrowserRouter>
          </QueryProvider>
        </Paper>
      </ThemeProvider>
    </React.StrictMode>
  );
};

createRoot(document.getElementById('root') as HTMLElement).render(<GemWallet />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

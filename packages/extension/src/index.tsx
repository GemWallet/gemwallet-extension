import React from 'react';
import './i18n';

import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes
} from 'react-router-dom';

import App from './App';
import {
  BrowserProvider,
  LedgerProvider,
  NetworkProvider,
  ServerProvider,
  WalletProvider
} from './contexts';
import reportWebVitals from './reportWebVitals';
import './index.css';

const theme = createTheme({
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
});

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
    })
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  sampleRate: process.env.NODE_ENV === 'development' ? 0.0 : 1.0,
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 0.0 : 1.0
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Paper style={{ height: '600px', width: '357px' }}>
        <BrowserRouter>
          <BrowserProvider>
            <WalletProvider>
              <NetworkProvider>
                <LedgerProvider>
                  <ServerProvider>
                    <App />
                  </ServerProvider>
                </LedgerProvider>
              </NetworkProvider>
            </WalletProvider>
          </BrowserProvider>
        </BrowserRouter>
      </Paper>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

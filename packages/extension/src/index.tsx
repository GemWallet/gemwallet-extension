import React from 'react';

import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserTracing, Replay } from '@sentry/browser';
import * as Sentry from '@sentry/react';
import ReactDOM from 'react-dom';
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
  ServerProvider,
  TransactionProgressProvider,
  WalletProvider
} from './contexts';
import reportWebVitals from './reportWebVitals';
import './index.css';

const halloweenTheme = createTheme({
  palette: {
    primary: {
      main: '#FF7518' // Vibrant Halloween orange
    },
    secondary: {
      main: '#FFA500' // Standard orange
    },
    text: {
      primary: '#FFFFFF', // White text
      secondary: '#FFD700' // Gold text
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1E1E1E' // Slightly lighter background for paper elements
    }
  },
  shape: {
    borderRadius: 8 // Adjust as needed
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: 700
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700
    },
    h5: {
      fontSize: '1.2rem',
      fontWeight: 700
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400
    },
    subtitle2: {
      fontSize: '0.9rem',
      fontWeight: 500
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400
    },
    body2: {
      fontSize: '0.9rem',
      fontWeight: 400
    },
    button: {
      fontSize: '1rem',
      fontWeight: 700,
      textTransform: 'uppercase'
    },
    caption: {
      fontSize: '0.8rem',
      fontWeight: 400
    },
    overline: {
      fontSize: '0.7rem',
      fontWeight: 400,
      textTransform: 'uppercase'
    }
  }
});

const theme = createTheme({
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
  },
  ...halloweenTheme
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
    }),
    new Replay()
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  sampleRate: process.env.NODE_ENV === 'development' ? 0.0 : 1.0,
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 0.0 : 1.0,
  replaysOnErrorSampleRate: process.env.NODE_ENV === 'development' ? 0.0 : 1.0
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Paper style={{ height: POPUP_HEIGHT - 20, width: POPUP_WIDTH }}>
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
      </Paper>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

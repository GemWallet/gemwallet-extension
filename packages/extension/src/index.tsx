import React from 'react';

import { BrowserTracing, Replay } from '@sentry/browser';
import * as Sentry from '@sentry/react';
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes
} from 'react-router-dom';

import reportWebVitals from './reportWebVitals';
import './index.css';
import { createRoot } from 'react-dom/client';
import { GemWallet } from './components/templates/GemWallet';

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

createRoot(document.getElementById('root') as HTMLElement).render(<GemWallet />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import { Component, ErrorInfo, ReactNode } from 'react';

import { Container, Typography, Button } from '@mui/material';
import * as Sentry from '@sentry/browser';
import { Extras } from '@sentry/types';

import { NETWORK_BANNER_HEIGHT } from '../../../constants';
import { useNetwork } from '../../../contexts';
import { WarningIcon } from './WarningIcon';

export interface ErrorBoundaryProps {
  children: ReactNode;
  hasOfflineBanner: boolean;
}

interface State {
  hasError: boolean;
}

class ErrorBoundaryClassComponent extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.withScope((scope) => {
      const extra = errorInfo as unknown as Extras;
      scope.setExtras(extra);
      Sentry.captureException(error);
    });
  }

  render() {
    const { hasOfflineBanner } = this.props;
    if (this.state.hasError) {
      return (
        <Container
          component="main"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '15x 16px',
            ...(hasOfflineBanner
              ? {
                  height: `calc(100vh - ${NETWORK_BANNER_HEIGHT}px)`,
                  position: 'fixed',
                  top: NETWORK_BANNER_HEIGHT
                }
              : { height: '100vh' })
          }}
        >
          <Container style={{ textAlign: 'center' }}>
            <WarningIcon style={{ transform: 'scale(0.75)' }} />
            <Typography variant="h5" component="h1">
              Sorry, something went wrong
            </Typography>
            <Typography variant="body1" style={{ marginTop: '30px' }}>
              We are getting this error fixed.
            </Typography>
            <Typography variant="body1">
              You may want to click on this refresh button or try again later.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              style={hasOfflineBanner ? { marginTop: 'calc(80px - 28px)' } : { marginTop: '80px' }}
              onClick={() => (window.location.href = 'index.html')}
            >
              Refresh
            </Button>
          </Container>
        </Container>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary: React.FC = ({ children }) => {
  const { hasOfflineBanner } = useNetwork();

  return (
    <ErrorBoundaryClassComponent hasOfflineBanner={hasOfflineBanner}>
      {children}
    </ErrorBoundaryClassComponent>
  );
};

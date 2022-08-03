import { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/browser';
import { Extras } from '@sentry/types';
import { Container, Typography, Button } from '@mui/material';
import { WarningIcon } from './WarningIcon';

export interface ErrorBoundaryProps {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
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
    if (this.state.hasError) {
      return (
        <Container
          component="main"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100vh',
            padding: '15x 16px'
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
            <Button variant="contained" fullWidth style={{ marginTop: '80px' }} onClick={() => {}}>
              Refresh
            </Button>
          </Container>
        </Container>
      );
    }

    return this.props.children;
  }
}

import { useContext } from 'react';
import * as Sentry from '@sentry/react';
import { ServerContext, ServerContextType } from './ServerContext';

export const useServer = (): ServerContextType => {
  const context = useContext(ServerContext);
  if (context === undefined) {
    const error = new Error('useServer must be used within a ServerProvider');
    Sentry.captureException(error);
  }
  return context;
};

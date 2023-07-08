import * as Sentry from '@sentry/react';

import { EventNetworkChangedEventListener } from '@gemwallet/constants';

export const on = (eventType: string, callback: (payload: any) => void) => {
  window.addEventListener('message', (event: EventNetworkChangedEventListener) => {
    try {
      // We only accept messages from ourselves
      if (event.source !== window) return;

      if (event.data.type && event.data.type === eventType) {
        callback(event.data.payload.result);
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  });
};

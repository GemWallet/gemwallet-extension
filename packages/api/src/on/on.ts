import * as Sentry from '@sentry/react';

import { EventEventListener, GEM_WALLET } from '@gemwallet/constants';

export const on = (eventType: string, callback: (payload: any) => void) => {
  window.addEventListener('message', (event: EventEventListener) => {
    try {
      // We only accept messages from ourselves
      if (event.origin !== window.origin) return;
      if (event.source !== window && event.data.app === GEM_WALLET) return;
      if (!event.data.source || event.data.source !== 'GEM_WALLET_MSG_REQUEST') return;

      if (event.data.type && event.data.type === eventType) {
        callback(event.data.payload.result);
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  });
};

import * as Sentry from '@sentry/react';

import { STORAGE_REMEMBER_SESSION } from '../constants';
import { loadFromChromeLocalStorage, saveInChromeLocalStorage } from './storageChromeLocal';

export const saveRememberSessionState = (checked: boolean) => {
  saveInChromeLocalStorage(STORAGE_REMEMBER_SESSION, JSON.stringify(checked));
};

export const loadRememberSessionState = async (): Promise<boolean> => {
  try {
    const storedState = await loadFromChromeLocalStorage(STORAGE_REMEMBER_SESSION);
    return storedState ? JSON.parse(storedState) === true : false;
  } catch (e) {
    Sentry.captureException(e);
    return false;
  }
};

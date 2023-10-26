import * as Sentry from '@sentry/react';

import { loadFromChromeLocalStorage, saveInChromeLocalStorage } from './storageChromeLocal';
import { STORAGE_REMEMBER_SESSION } from '../constants';

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

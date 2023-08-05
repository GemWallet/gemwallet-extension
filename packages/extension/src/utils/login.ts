import { STORAGE_REMEMBER_SESSION } from '../constants';
import { loadFromChromeStorage, saveInChromeStorage } from './storageChrome';

export const saveRememberSessionState = (checked: boolean) => {
  saveInChromeStorage(STORAGE_REMEMBER_SESSION, JSON.stringify(checked));
};

export const loadRememberSessionState = async (): Promise<boolean> => {
  try {
    const storedState = await loadFromChromeStorage(STORAGE_REMEMBER_SESSION);
    return storedState ? JSON.parse(storedState[STORAGE_REMEMBER_SESSION]) === true : false;
  } catch (e) {
    return false;
  }
};

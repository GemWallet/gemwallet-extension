import { STORAGE_REMEMBER_SESSION } from '../constants';

export const saveRememberSessionState = (checked: boolean) => {
  localStorage.setItem(STORAGE_REMEMBER_SESSION, JSON.stringify(checked));
};

export const loadRememberSessionState = (): boolean => {
  try {
    const storedState = localStorage.getItem(STORAGE_REMEMBER_SESSION);
    return storedState ? JSON.parse(storedState) === true : false;
  } catch (e) {
    return false;
  }
};

/*
 * Manages the storage in Chrome storage
 */

export const saveInChromeStorage = (key: string, value: string) => {
  if (process.env.NODE_ENV === 'production') {
    chrome.storage.local.set({ [key]: value });
  }
};

export const loadFromChromeStorage = (key: string) => {
  if (process.env.NODE_ENV === 'production') {
    return chrome.storage.local.get(key);
  }
};

export const generateKey = () => {
  return (Date.now() + Math.random()).toString();
};

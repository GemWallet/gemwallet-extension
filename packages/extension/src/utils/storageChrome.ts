/*
 * Manages the storage in Chrome storage
 */

export const saveInChromeStorage = (key: string, value: string) => {
  if (process.env.NODE_ENV === 'production') {
    chrome.storage.local.set({ [key]: value });
  }
};

export const loadFromChromeStorage = (key: string, deleteAfterLoad: boolean = false) => {
  if (process.env.NODE_ENV === 'production') {
    const data = chrome.storage.local.get(key);
    if (deleteAfterLoad) {
      deleteFromChromeStorage(key);
    }
    return data;
  }
};

export const deleteFromChromeStorage = (key: string) => {
  if (process.env.NODE_ENV === 'production') {
    chrome.storage.local.remove(key);
  }
};

export const generateKey = () => {
  return (Date.now() + Math.random()).toString();
};

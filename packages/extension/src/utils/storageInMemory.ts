/*
 * Manages the storage in memory
 */

export const saveInMemory = (key: string, value: string) => {
  try {
    chrome.storage.local.set({ [key]: value });
  } catch (e) {
    throw e;
  }
};

export const loadFromMemory = (key: string) => {
  try {
    return chrome.storage.local.get(key);
  } catch (e) {
    throw e;
  }
};

export const generateKey = () => {
  return (Date.now() + Math.random()).toString();
};

/*
 * Manages the storage in Chrome local storage
 */

export const saveInChromeLocalStorage = (key: string, value: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'production') {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } else {
      reject(new Error('Not in production environment'));
    }
  });
};

export const loadFromChromeLocalStorage = (
  key: string,
  deleteAfterLoad: boolean = false
): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'production') {
      chrome.storage.local.get(key, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          const data = result[key];
          if (deleteAfterLoad) {
            deleteFromChromeLocalStorage(key);
          }
          resolve(data);
        }
      });
    } else {
      reject(new Error('Not in production environment'));
    }
  });
};

export const deleteFromChromeLocalStorage = (key: string) => {
  if (process.env.NODE_ENV === 'production') {
    chrome.storage.local.remove(key);
  }
};

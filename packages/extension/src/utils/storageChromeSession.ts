/*
 * Manages the storage in Chrome session storage
 */

interface CypressWindow extends Window {
  Cypress?: unknown;
}

export const saveInChromeSessionStorage = (key: string, value: unknown): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'production' || (window as CypressWindow).Cypress) {
      chrome.storage.session.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

export const loadFromChromeSessionStorage = (
  key: string,
  deleteAfterLoad: boolean = false
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    chrome.storage.session.get(key, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        const data = result[key];
        if (deleteAfterLoad) {
          deleteFromChromeSessionStorage(key);
        }
        resolve(data);
      }
    });
  });
};

export const deleteFromChromeSessionStorage = (key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'production') {
      chrome.storage.session.remove(key, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

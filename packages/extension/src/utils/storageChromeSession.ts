/*
 * Manages the storage in Chrome session storage
 */

export const saveInChromeSessionStorage = (key: string, value: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'production') {
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
): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'production') {
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
    } else {
      resolve(null);
    }
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

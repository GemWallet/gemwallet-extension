/*
 * Manages the storage in localStorage
 */

export const saveData = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const loadData = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    /*
     * If localStorage is disabled or blocked by the browser,
     * a SecurityError exception will be thrown when trying to access localStorage.
     *  If the key argument passed to localStorage.getItem() is not a string,
     * a TypeError exception will be thrown.
     * If the key argument passed to localStorage.getItem() does not exist in localStorage,
     * null will be returned.
     */
    return null;
  }
};

export const removeData = (key: string) => {
  localStorage.removeItem(key);
};

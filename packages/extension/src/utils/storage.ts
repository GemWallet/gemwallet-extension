export const saveData = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    throw e;
  }
};

export const loadData = (key: string) => {
  return localStorage.getItem(key);
};

export const removeData = (key: string) => {
  localStorage.removeItem(key);
};

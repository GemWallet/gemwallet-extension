export const saveData = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const loadData = (key: string) => {
  return localStorage.getItem(key);
};

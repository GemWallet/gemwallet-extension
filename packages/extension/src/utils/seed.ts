import { STORAGE_SEED } from '../constants/localStorage';
import { decrypt, encrypt, loadData, saveData, removeData } from '.';

export const loadSeed = (password: string) => {
  return decrypt(loadData(STORAGE_SEED) || '', password);
};

export const saveSeed = (seed: string, password: string) => {
  const encryptedSeed = encrypt(seed, password);
  saveData(STORAGE_SEED, encryptedSeed);
};

export const removeSeed = () => {
  return Promise.resolve().then(function () {
    return removeData(STORAGE_SEED);
  });
};

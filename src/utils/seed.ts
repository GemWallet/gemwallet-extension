import { STORAGE_SEED } from '../constants/localStorage';
import { decrypt, encrypt, loadData, saveData } from '.';

export const loadSeed = (password: string) => {
  return decrypt(loadData(STORAGE_SEED) || '', password);
};

export const saveSeed = (seed: string, password: string) => {
  const encryptedSeed = encrypt(seed, password);
  saveData(STORAGE_SEED, encryptedSeed);
};

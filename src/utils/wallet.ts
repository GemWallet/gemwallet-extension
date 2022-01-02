import { STORAGE_SEED } from '../constants/localStorage';
import { decrypt, encrypt, loadData, saveData } from '.';

export const loadWallet = (password: string) => {
  return decrypt(loadData(STORAGE_SEED) || '', password);
};

export const saveWallet = (seed: string, password: string) => {
  const encryptedWallet = encrypt(seed, password);
  saveData(STORAGE_SEED, encryptedWallet);
};

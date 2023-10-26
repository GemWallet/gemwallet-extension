import { decrypt, encrypt } from './crypto';
import { loadData, removeData, saveData } from './storageLocal';
import { STORAGE_SELECTED_WALLET, STORAGE_WALLETS } from '../constants/storage';
import { Wallet } from '../types';

export interface WalletToSave extends Omit<Wallet, 'name'> {
  name?: string;
}

export const saveWallet = (wallet: WalletToSave, password: string) => {
  const wallets = loadWallets(password);

  if (!wallet.name) {
    wallet.name = `Wallet ${wallets.length + 1}`;
  }

  wallets.push(wallet as Wallet);

  try {
    saveData(STORAGE_WALLETS, encrypt(JSON.stringify(wallets), password));
  } catch (e) {
    throw e;
  }
};

export const loadWallets = (password: string): Wallet[] => {
  try {
    const data = loadData(STORAGE_WALLETS);
    if (data) {
      const decryptedData = decrypt(data, password);
      if (decryptedData !== '') {
        return JSON.parse(decryptedData);
      }
    }
    return [];
  } catch (error) {
    return [];
  }
};

export const removeWallets = () => {
  return Promise.resolve().then(() => {
    removeData(STORAGE_WALLETS);
  });
};

export const saveSelectedWallet = (index: number): void => {
  try {
    saveData(STORAGE_SELECTED_WALLET, String(index));
  } catch (e) {
    throw e;
  }
};

export const loadSelectedWallet = (): number => {
  try {
    const data = loadData(STORAGE_SELECTED_WALLET);
    return data ? Number(JSON.parse(data)) : 0;
  } catch (e) {
    return 0;
  }
};

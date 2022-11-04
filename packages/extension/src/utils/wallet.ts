import { STORAGE_WALLETS } from '../constants/localStorage';
import { Wallet } from '../types';
import { decrypt, encrypt } from './crypto';
import { loadData, saveData, removeData } from './storage';

interface WalletToSave extends Omit<Wallet, 'name'> {
  name?: string;
}

export const saveWallet = (wallet: WalletToSave, password: string) => {
  const data = loadData(STORAGE_WALLETS);
  let wallets: Wallet[] = [];
  if (data) {
    const decryptedData = decrypt(data, password);
    if (decryptedData !== undefined) {
      wallets = JSON.parse(decryptedData);
    }
  }

  if (!wallet.name) {
    wallet.name = `Wallet ${wallets.length + 1}`;
  }

  wallets.push(wallet as Wallet);
  const encryptedWallets = encrypt(JSON.stringify(wallets), password);

  try {
    saveData(STORAGE_WALLETS, encryptedWallets);
  } catch (e) {
    throw e;
  }
};

export const loadWallets = (password: string): Wallet[] => {
  const data = loadData(STORAGE_WALLETS);
  if (data) {
    const decryptedData = decrypt(data, password);
    if (decryptedData !== undefined) {
      return JSON.parse(decryptedData);
    }
  }
  return [];
};

export const removeWallets = () => {
  return Promise.resolve().then(() => {
    removeData(STORAGE_WALLETS);
  });
};

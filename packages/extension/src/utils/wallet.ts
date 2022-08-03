import { STORAGE_WALLETS } from '../constants/localStorage';
import { decrypt, encrypt, loadData, saveData, removeData } from '.';
import { Wallet } from '../types';

interface WalletToSave extends Omit<Wallet, 'name'> {
  name?: string;
}

export const saveWallet = (wallet: WalletToSave, password: string) => {
  const wallets = JSON.parse(loadData(STORAGE_WALLETS) || '[]');
  if (!wallet.name) {
    wallet.name = `Wallet ${wallets.length + 1}`;
  }
  const encryptedWallet = encrypt(JSON.stringify(wallet), password);
  wallets.push(encryptedWallet);
  const stringifiedWallets = JSON.stringify(wallets);
  try {
    saveData(STORAGE_WALLETS, stringifiedWallets);
  } catch (e) {
    throw e;
  }
};

export const loadWallets = (password: string): Wallet[] => {
  const data = loadData(STORAGE_WALLETS);
  if (data) {
    const wallets = JSON.parse(data);
    return wallets.reduce((acc: Wallet[], wallet: string) => {
      const decryptedWallet = decrypt(wallet, password);
      if (decryptedWallet !== undefined) {
        acc.push(JSON.parse(decryptedWallet));
      }
      return acc;
    }, []);
  }
  return [];
};

export const removeWallets = () => {
  return Promise.resolve().then(() => {
    removeData(STORAGE_WALLETS);
  });
};

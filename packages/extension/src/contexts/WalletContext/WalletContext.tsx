import { useState, createContext, FC, useCallback, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { ECDSA, Wallet } from 'xrpl';

import {
  GEM_WALLET,
  InternalReceivePasswordContentMessage,
  InternalReceiveSignOutContentMessage,
  MSG_INTERNAL_RECEIVE_PASSWORD,
  MSG_INTERNAL_RECEIVE_SIGN_OUT
} from '@gemwallet/constants';

import { HOME_PATH, STORAGE_WALLETS } from '../../constants';
import { Wallet as WalletToSaveType } from '../../types';
import { WalletLedger } from '../../types';
import {
  encrypt,
  loadSelectedWallet,
  loadWallets,
  numbersToSeed,
  removeWalletFromTrustedApp,
  removeWallets,
  saveData,
  saveSelectedWallet,
  saveWallet
} from '../../utils';

type ImportSeedProps = {
  password: string;
  seed: string;
  walletName?: string;
  algorithm?: ECDSA;
};

type ImportNumbersProps = {
  password: string;
  numbers: string[];
  walletName?: string;
  // Default algorithm is: ed25519
  algorithm?: ECDSA;
};

export interface WalletContextType {
  signIn: (password: string, rememberSession?: boolean) => boolean;
  signOut: () => void;
  generateWallet: (walletName?: string) => Wallet;
  selectWallet: (index: number) => void;
  isValidSeed: (seed: string) => boolean;
  importSeed: ({ password, seed, walletName, algorithm }: ImportSeedProps) => boolean | undefined;
  isValidMnemonic: (mnemonic: string) => boolean;
  importMnemonic: (password: string, mnemonic: string, walletName?: string) => boolean | undefined;
  isValidNumbers: (numbers: string[]) => boolean;
  isPasswordCorrect: (password: string) => boolean;
  importNumbers: ({
    password,
    numbers,
    walletName,
    algorithm
  }: ImportNumbersProps) => boolean | undefined;
  getCurrentWallet: () => WalletLedger | undefined;
  getWalletByPublicAddress: (publicAddress: string) => WalletLedger | undefined;
  renameWallet: (name: string, publicAddress: string) => void;
  removeWallet: (publicAddress: string) => void;
  wallets: WalletLedger[];
  selectedWallet: number;
}

export const WalletContext = createContext<WalletContextType>({
  signIn: () => false,
  signOut: () => {},
  selectWallet: () => {},
  generateWallet: () => Wallet.generate(),
  getCurrentWallet: () => undefined,
  getWalletByPublicAddress: () => undefined,
  isValidSeed: () => false,
  importSeed: () => false,
  isValidMnemonic: () => false,
  importMnemonic: () => false,
  isValidNumbers: () => false,
  isPasswordCorrect: () => false,
  importNumbers: () => false,
  renameWallet: () => {},
  removeWallet: () => {},
  wallets: [],
  selectedWallet: 0
});

interface Props {
  children: React.ReactElement;
}

export const WalletProvider: FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<WalletLedger[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<number>(loadSelectedWallet());
  const [password, setPassword] = useState<string | null>(null);

  const signIn = useCallback((password: string, rememberSession?: boolean) => {
    const wallets = loadWallets(password);
    if (wallets.length) {
      if (process.env.NODE_ENV === 'production' && rememberSession === true) {
        chrome.runtime.sendMessage<InternalReceivePasswordContentMessage>({
          app: GEM_WALLET,
          type: MSG_INTERNAL_RECEIVE_PASSWORD,
          payload: {
            password
          }
        });
      }

      const _wallets = wallets.map(({ name, publicAddress, seed, mnemonic, algorithm }) => {
        if (seed) {
          return {
            name,
            publicAddress,
            seed,
            wallet: Wallet.fromSeed(seed, { algorithm })
          };
        }
        return {
          name,
          publicAddress,
          mnemonic,
          wallet: Wallet.fromMnemonic(mnemonic!)
        };
      });
      setWallets(_wallets);
      setPassword(password);
      return true;
    }
    return false;
  }, []);

  const signOut = useCallback(() => {
    setWallets([]);
    if (process.env.NODE_ENV === 'production') {
      chrome.runtime.sendMessage<InternalReceiveSignOutContentMessage>({
        app: GEM_WALLET,
        type: MSG_INTERNAL_RECEIVE_SIGN_OUT
      });
    }
    navigate(HOME_PATH);
  }, [navigate]);

  const generateWallet = useCallback(() => {
    return Wallet.generate();
  }, []);

  const selectWallet = useCallback((index: number) => {
    saveSelectedWallet(index);
    setSelectedWallet(index);
  }, []);

  const isValidSeed = useCallback((seed: string) => {
    try {
      const wallet = Wallet.fromSeed(seed);
      if (wallet.seed) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }, []);

  /* Returns:
   * true: if import is successful
   * false: if import is not successful
   * undefined: if wallet is already present
   */
  const importSeed = useCallback(
    ({ password, seed, walletName, algorithm }: ImportSeedProps) => {
      try {
        const wallet = Wallet.fromSeed(seed, { algorithm });
        if (wallets.filter((w) => w.publicAddress === wallet.address).length > 0) {
          return undefined;
        }
        const _wallet = {
          publicAddress: wallet.address,
          seed,
          algorithm
        };
        saveWallet(_wallet, password);
        setWallets((wallets) => [
          ...wallets,
          {
            name: walletName || `Wallet ${wallets.length + 1}`,
            publicAddress: wallet.address,
            seed,
            wallet
          }
        ]);
        if (wallet.seed) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    [wallets]
  );

  const isValidMnemonic = useCallback((mnemonic: string) => {
    try {
      const wallet = Wallet.fromMnemonic(mnemonic);
      if (wallet) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }, []);

  const importMnemonic = useCallback(
    (password: string, mnemonic: string, walletName?: string) => {
      try {
        const wallet = Wallet.fromMnemonic(mnemonic);
        if (wallets.filter((w) => w.publicAddress === wallet.classicAddress).length > 0) {
          return undefined;
        }
        const _wallet = {
          publicAddress: wallet.address,
          mnemonic
        };
        saveWallet(_wallet, password);
        setWallets((wallets) => [
          ...wallets,
          {
            name: walletName || `Wallet ${wallets.length + 1}`,
            publicAddress: wallet.address,
            mnemonic,
            wallet
          }
        ]);
        if (wallet) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    [wallets]
  );

  const isValidNumbers = useCallback((numbers: string[]) => {
    try {
      const seed = numbersToSeed(numbers);
      const wallet = Wallet.fromSeed(seed);
      if (wallet) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }, []);

  const isPasswordCorrect = useCallback(
    (passwordToTest: string) => {
      if (password === passwordToTest) {
        return true;
      }
      return false;
    },
    [password]
  );

  const importNumbers = useCallback(
    ({ password, numbers, walletName, algorithm }: ImportNumbersProps) => {
      try {
        const seed = numbersToSeed(numbers);
        const wallet = Wallet.fromSeed(seed, { algorithm });
        if (wallets.filter((w) => w.publicAddress === wallet.address).length > 0) {
          return undefined;
        }
        const _wallet = {
          publicAddress: wallet.address,
          seed
        };
        saveWallet(_wallet, password);
        setWallets((wallets) => [
          ...wallets,
          {
            name: walletName || `Wallet ${wallets.length + 1}`,
            publicAddress: wallet.address,
            seed,
            wallet
          }
        ]);
        if (wallet) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    [wallets]
  );

  const renameWallet = useCallback(
    (name: string, publicAddress: string) => {
      const walletIndex = wallets.findIndex((wallet) => wallet.publicAddress === publicAddress);
      if (walletIndex >= 0 && password) {
        const newWallet = { ...wallets[walletIndex] };
        newWallet.name = name;
        const newWallets = [...wallets];
        newWallets[walletIndex] = newWallet;
        setWallets(newWallets);
        const walletToSave: WalletToSaveType[] = newWallets.map(
          ({ name, publicAddress, seed, mnemonic }) => ({
            name,
            publicAddress,
            seed,
            mnemonic
          })
        );
        saveData(STORAGE_WALLETS, encrypt(JSON.stringify(walletToSave), password));
      }
    },
    [password, wallets]
  );

  const removeWallet = useCallback(
    (publicAddress: string) => {
      const walletIndex = wallets.findIndex((wallet) => wallet.publicAddress === publicAddress);
      if (walletIndex >= 0 && password) {
        if (wallets.length === 1) {
          removeWallets();
        }
        const newWallets = [...wallets];
        newWallets.splice(walletIndex, 1);
        setWallets(newWallets);
        const walletToSave: WalletToSaveType[] = newWallets.map(
          ({ name, publicAddress, seed, mnemonic }) => ({
            name,
            publicAddress,
            seed,
            mnemonic
          })
        );
        // We also want to remove the trusted apps associated to this wallet
        removeWalletFromTrustedApp(walletIndex);
        saveData(STORAGE_WALLETS, encrypt(JSON.stringify(walletToSave), password));
      }
    },
    [password, wallets]
  );

  const getCurrentWallet = useCallback(() => {
    return wallets[selectedWallet];
  }, [selectedWallet, wallets]);

  const getWalletByPublicAddress = useCallback(
    (publicAddress: string) => {
      return wallets.filter((wallet) => wallet.publicAddress === publicAddress)[0] || undefined;
    },
    [wallets]
  );

  useEffect(() => {
    if (wallets.length > 0 && selectedWallet >= wallets.length) {
      selectWallet(0);
    }
  }, [selectWallet, selectedWallet, wallets]);

  const value: WalletContextType = {
    signIn,
    signOut,
    selectWallet,
    generateWallet,
    getCurrentWallet,
    getWalletByPublicAddress,
    isValidSeed,
    importSeed,
    isValidMnemonic,
    importMnemonic,
    isValidNumbers,
    isPasswordCorrect,
    importNumbers,
    renameWallet,
    removeWallet,
    wallets,
    selectedWallet
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

import { useContext, useState, createContext, FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { Wallet } from 'xrpl';
import { HOME_PATH } from '../../constants';
import { WalletLedger } from '../../types';
import { loadWallets } from '../../utils';

export interface WalletContextType {
  signIn: (password: string) => boolean;
  signOut: () => void;
  generateWallet: (walletName?: string) => Wallet;
  importSeed: (seed: string, walletName?: string) => boolean;
  importMnemonic: (mnemonic: string, walletName?: string) => boolean;
  getCurrentWallet: () => WalletLedger | undefined;
  wallets: WalletLedger[];
  selectedWallet: number;
}

const WalletContext = createContext<WalletContextType>({
  signIn: () => false,
  signOut: () => {},
  generateWallet: () => Wallet.generate(),
  getCurrentWallet: () => undefined,
  importSeed: () => false,
  importMnemonic: () => false,
  wallets: [],
  selectedWallet: 0
});

const WalletProvider: FC = ({ children }) => {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<WalletLedger[]>([]);
  // TODO: Use setSelectedWallet when multi-wallet creation and choosing feature will be done
  /* The default selectedWallet will be selected by a value in local storage
   * In order to be sure that the last selected wallet of the user stays the same
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedWallet, setSelectedWallet] = useState<number>(0);

  const signIn = useCallback((password: string) => {
    const wallets = loadWallets(password);
    if (wallets.length) {
      const _wallets = wallets.map(({ name, publicAddress, seed, mnemonic }) => {
        if (seed) {
          return {
            name,
            publicAddress,
            seed,
            wallet: Wallet.fromSeed(seed)
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
      return true;
    }
    return false;
  }, []);

  const signOut = useCallback(() => {
    setWallets([]);
    navigate(HOME_PATH);
  }, [navigate]);

  const generateWallet = useCallback((walletName?: string) => {
    const wallet = Wallet.generate();
    setWallets((wallets) => [
      ...wallets,
      {
        name: walletName || `Wallet ${wallets.length + 1}`,
        publicAddress: wallet.address,
        wallet
      }
    ]);
    return wallet;
  }, []);

  const importSeed = useCallback((seed: string, walletName?: string) => {
    try {
      const wallet = Wallet.fromSeed(seed);
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
  }, []);

  const importMnemonic = useCallback((mnemonic: string, walletName?: string) => {
    try {
      const wallet = Wallet.fromMnemonic(mnemonic);
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
  }, []);

  const getCurrentWallet = useCallback(() => {
    return wallets[selectedWallet];
  }, [selectedWallet, wallets]);

  const value: WalletContextType = {
    signIn,
    signOut,
    generateWallet,
    getCurrentWallet,
    importSeed,
    importMnemonic,
    wallets,
    selectedWallet
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    const error = new Error('useWallet must be used within a WalletProvider');
    Sentry.captureException(error);
    throw error;
  }
  return context;
};

export { WalletProvider, WalletContext, useWallet };

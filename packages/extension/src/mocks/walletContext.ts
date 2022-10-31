import { Wallet } from 'xrpl';
import { WalletContextType } from '../contexts';
import { WalletLedger } from '../types';

export const WALLET_SEED = 'spoVYVKVDaWYZERvh3xSgQPTu2X13';

const mockWallet = Wallet.fromSeed(WALLET_SEED);

const mockWalletLedger: WalletLedger = {
  name: 'Wallet 1',
  publicAddress: mockWallet.address,
  wallet: mockWallet
};

export interface GenerateWalletContextParams {
  generateWallet?: () => Wallet;
  getCurrentWallet?: () => WalletLedger | undefined;
  importSeed?: () => true;
  importMnemonic?: () => true;
  selectedWallet?: number;
  wallets?: WalletLedger[];
}

export const generateWalletContext = (params?: GenerateWalletContextParams): WalletContextType => {
  const {
    generateWallet = () => mockWallet,
    getCurrentWallet = () => mockWalletLedger,
    importSeed = () => true,
    importMnemonic = () => true,
    selectedWallet = 0,
    wallets = [mockWalletLedger]
  } = params || {};

  return {
    signIn: jest.fn(),
    signOut: jest.fn(),
    generateWallet,
    getCurrentWallet,
    importSeed,
    importMnemonic,
    selectedWallet,
    wallets
  };
};

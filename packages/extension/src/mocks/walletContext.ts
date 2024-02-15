import { Wallet } from 'xrpl';

import { WalletContextType } from '../contexts';
import { WalletLedger } from '../types';
import { vi } from 'vitest';

export const WALLET_SEED = 'spoVYVKVDaWYZERvh3xSgQPTu2X13';
export const WALLET_MNEMONIC =
  'frozen voyage arrest venture question deny print brother genuine hip tooth rigid life output bitter raccoon kidney wine urban rookie allow envelope pitch marriage';

const mockWallet = Wallet.fromSeed(WALLET_SEED);

const mockWalletLedger: WalletLedger = {
  name: 'Wallet 1',
  publicAddress: mockWallet.address,
  wallet: mockWallet,
  seed: WALLET_SEED,
  mnemonic: WALLET_MNEMONIC
};

export interface GenerateWalletContextParams {
  selectWallet?: () => void;
  generateWallet?: () => Wallet;
  getCurrentWallet?: () => WalletLedger | undefined;
  getWalletByPublicAddress?: () => WalletLedger | undefined;
  isValidSeed?: () => boolean;
  importSeed?: () => boolean;
  isValidMnemonic?: () => boolean;
  importMnemonic?: () => boolean;
  isValidNumbers?: () => boolean;
  isPasswordCorrect?: () => boolean;
  importNumbers?: () => boolean;
  renameWallet?: () => void;
  removeWallet?: () => void;
  selectedWallet?: number;
  wallets?: WalletLedger[];
}

export const generateWalletContext = (params?: GenerateWalletContextParams): WalletContextType => {
  const {
    generateWallet = () => mockWallet,
    getCurrentWallet = () => mockWalletLedger,
    getWalletByPublicAddress = () => mockWalletLedger,
    isValidSeed = () => true,
    importSeed = () => true,
    isValidMnemonic = () => true,
    importMnemonic = () => true,
    isValidNumbers = () => true,
    isPasswordCorrect = () => true,
    importNumbers = () => true,
    selectedWallet = 0,
    wallets = [mockWalletLedger]
  } = params || {};

  return {
    signIn: vi.fn(),
    signOut: vi.fn(),
    selectWallet: vi.fn(),
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
    renameWallet: vi.fn(),
    removeWallet: vi.fn(),
    selectedWallet,
    wallets
  };
};

import { Wallet } from 'xrpl';

export const WALLET_SEED = 'spoVYVKVDaWYZERvh3xSgQPTu2X13';

export const mockWallet = Wallet.fromSeed(WALLET_SEED);

export const mockWalletLedger = {
  name: 'Wallet 1',
  publicAddress: mockWallet.address,
  wallet: mockWallet
};

export const valueLedgerContext = {
  signIn: jest.fn(),
  signOut: jest.fn(),
  generateWallet: () => mockWallet,
  importSeed: () => true,
  sendPayment: jest.fn(),
  estimateNetworkFees: jest.fn(),
  selectedWallet: 0,
  wallets: [mockWalletLedger]
};

import { LedgerContextType } from '../contexts';

export const valueLedgerContext: LedgerContextType = {
  sendPayment: jest.fn(),
  setTrustline: jest.fn(),
  signMessage: jest.fn(),
  estimateNetworkFees: jest.fn(),
  getNFTs: jest.fn(),
  getTransactions: jest.fn(),
  fundWallet: jest.fn()
};

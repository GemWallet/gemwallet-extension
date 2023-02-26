import { LedgerContextType } from '../contexts';

export const valueLedgerContext: LedgerContextType = {
  sendPayment: jest.fn(),
  addTrustline: jest.fn(),
  signMessage: jest.fn(),
  estimateNetworkFees: jest.fn(),
  getNFTs: jest.fn(),
  getTransactions: jest.fn()
};

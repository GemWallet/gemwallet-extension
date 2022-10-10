import { LedgerContextType } from '../contexts';

export const valueLedgerContext: LedgerContextType = {
  sendPayment: jest.fn(),
  signMessage: jest.fn(),
  estimateNetworkFees: jest.fn()
};

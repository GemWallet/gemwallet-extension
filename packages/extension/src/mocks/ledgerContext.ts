import { vi } from 'vitest';
import { LedgerContextType } from '../contexts';

export const valueLedgerContext: LedgerContextType = {
  sendPayment: vi.fn(),
  setTrustline: vi.fn(),
  signMessage: vi.fn(),
  estimateNetworkFees: vi.fn(),
  getNFTs: vi.fn(),
  getTransactions: vi.fn(),
  fundWallet: vi.fn(),
  mintNFT: vi.fn(),
  createNFTOffer: vi.fn(),
  cancelNFTOffer: vi.fn(),
  acceptNFTOffer: vi.fn(),
  burnNFT: vi.fn(),
  setAccount: vi.fn(),
  createOffer: vi.fn(),
  cancelOffer: vi.fn(),
  submitTransaction: vi.fn(),
  signTransaction: vi.fn(),
  submitBulkTransactions: vi.fn(),
  getAccountInfo: vi.fn(),
  getNFTData: vi.fn(),
  deleteAccount: vi.fn(),
  getNFTInfo: vi.fn(),
  getLedgerEntry: vi.fn(),
  setRegularKey: vi.fn(),
  setHook: vi.fn(),
  // MPToken
  addMPTokenAuthorization: vi.fn(),
  removeMPTokenAuthorization: vi.fn(),
  createMPTokenIssuance: vi.fn(),
  destroyMPTokenIssuance: vi.fn(),
  setMPTokenIssuance: vi.fn()
};

import { LedgerContextType } from '../contexts';

export const valueLedgerContext: LedgerContextType = {
  sendPayment: jest.fn(),
  setTrustline: jest.fn(),
  signMessage: jest.fn(),
  estimateNetworkFees: jest.fn(),
  getNFTs: jest.fn(),
  getTransactions: jest.fn(),
  fundWallet: jest.fn(),
  mintNFT: jest.fn(),
  createNFTOffer: jest.fn(),
  cancelNFTOffer: jest.fn(),
  acceptNFTOffer: jest.fn(),
  burnNFT: jest.fn(),
  setAccount: jest.fn(),
  createOffer: jest.fn(),
  cancelOffer: jest.fn(),
  submitTransaction: jest.fn(),
  signTransaction: jest.fn(),
  submitTransactionsBulk: jest.fn(),
  getAccountInfo: jest.fn(),
  getNFTData: jest.fn(),
  deleteAccount: jest.fn(),
  getNFTInfo: jest.fn(),
  getLedgerEntry: jest.fn()
};

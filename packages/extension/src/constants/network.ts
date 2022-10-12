import { Network, NetworkServer } from '../types';

export const NETWORK = {
  [Network.MAINNET]: {
    name: Network.MAINNET,
    server: NetworkServer.MAINNET,
    description: 'Main network using the production version of the XRP Ledger'
  },
  [Network.TESTNET]: {
    name: Network.TESTNET,
    server: NetworkServer.TESTNET,
    description:
      'An alternate network that acts as a testing ground for the XRP Ledger, without impacting production users and risking real money.'
  },
  [Network.DEVNET]: {
    name: Network.DEVNET,
    server: NetworkServer.DEVNET,
    description:
      'A preview of upcoming features, where unstable changes to the core XRP Ledger may be tested out.'
  },
  [Network.NFT_DEVNET]: {
    name: Network.NFT_DEVNET,
    server: NetworkServer.NFT_DEVNET,
    description: 'A preview of the XLS-20d standard for non-fungible tokens on the XRP Ledger.'
  }
};

import { Network, NetworkServer } from '../types';

export const NETWORK = {
  [Network.MAINNET]: {
    name: Network.MAINNET,
    server: NetworkServer.MAINNET,
    description: 'Main network using the production version of the XRP Ledger.'
  },
  [Network.TESTNET]: {
    name: Network.TESTNET,
    server: NetworkServer.TESTNET,
    description:
      'Acts as a testing network, without impacting production users and risking real money.'
  },
  [Network.DEVNET]: {
    name: Network.DEVNET,
    server: NetworkServer.DEVNET,
    description: 'A preview of upcoming features, where unstable changes are tested out.'
  },
  [Network.NFT_DEVNET]: {
    name: Network.NFT_DEVNET,
    server: NetworkServer.NFT_DEVNET,
    description: 'A preview of the XLS-20d standard for non-fungible tokens on the XRP Ledger.'
  }
};

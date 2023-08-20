export enum Network {
  MAINNET = 'Mainnet',
  TESTNET = 'Testnet',
  DEVNET = 'Devnet',
  AMM_DEVNET = 'AMM-Devnet',
  CUSTOM = 'Custom'
}

export const MAINNET_CLIO_NODES = ['wss://s1.ripple.com', 'wss://s2.ripple.com'];
export const MAINNET_NODES = ['wss://xrplcluster.com', ...MAINNET_CLIO_NODES];
export const TESTNET_NODES = ['wss://s.altnet.rippletest.net:51233', 'wss://testnet.xrpl-labs.com'];
export const DEVNET_NODES = ['wss://s.devnet.rippletest.net:51233'];
export const AMM_DEVNET_NODES = ['wss://amm.devnet.rippletest.net:51233'];

export const NETWORK = {
  [Network.MAINNET]: {
    name: Network.MAINNET,
    server: MAINNET_NODES[0],
    description: 'Main network using the production version of the XRP Ledger.'
  },
  [Network.TESTNET]: {
    name: Network.TESTNET,
    server: TESTNET_NODES[0],
    description:
      'Acts as a testing network, without impacting production users and risking real money.'
  },
  [Network.DEVNET]: {
    name: Network.DEVNET,
    server: DEVNET_NODES[0],
    description: 'A preview of upcoming features, where unstable changes are tested out.'
  },
  [Network.AMM_DEVNET]: {
    name: Network.AMM_DEVNET,
    server: AMM_DEVNET_NODES[0],
    description: 'XLS-30d Automated Market Makers preview network.'
  },
  [Network.CUSTOM]: {
    name: Network.CUSTOM,
    server: '',
    description: 'Custom network'
  }
};

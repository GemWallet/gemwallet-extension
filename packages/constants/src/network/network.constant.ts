export enum Network {
  MAINNET = 'Mainnet',
  TESTNET = 'Testnet',
  DEVNET = 'Devnet',
  AMM_DEVNET = 'AMM-Devnet',
  CUSTOM = 'Custom'
}

export enum NetworkServer {
  MAINNET = 'wss://xrplcluster.com',
  TESTNET = 'wss://s.altnet.rippletest.net:51233',
  DEVNET = 'wss://s.devnet.rippletest.net:51233',
  AMM_DEVNET = 'wss://amm.devnet.rippletest.net:51233'
}

export enum MainnetClioServer {
  S1 = 'wss://s1.ripple.com',
  S2 = 'wss://s2.ripple.com'
}

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
  [Network.AMM_DEVNET]: {
    name: Network.AMM_DEVNET,
    server: NetworkServer.AMM_DEVNET,
    description: 'XLS-30d Automated Market Makers preview network.'
  },
  [Network.CUSTOM]: {
    name: Network.CUSTOM,
    server: '',
    description: 'Custom network'
  }
};

export enum Network {
  MAINNET = 'Mainnet',
  TESTNET = 'Testnet',
  DEVNET = 'Devnet',
  AMM_DEVNET = 'AMM-Devnet'
}

export enum NetworkServer {
  MAINNET = 'wss://xrplcluster.com',
  TESTNET = 'wss://s.altnet.rippletest.net:51233',
  DEVNET = 'wss://s.devnet.rippletest.net:51233',
  AMM_DEVNET = 'wss://amm.devnet.rippletest.net:51233'
}

// Network description only embeds the translation key. You can pass the translation key to i18n.t() to get the
// translation.
export const NETWORK = {
  [Network.MAINNET]: {
    name: Network.MAINNET,
    server: NetworkServer.MAINNET,
    description_key: 'TEXT_NETWORK_DESCRIPTION_MAINNET'
  },
  [Network.TESTNET]: {
    name: Network.TESTNET,
    server: NetworkServer.TESTNET,
    description_key: 'TEXT_NETWORK_DESCRIPTION_TESTNET'
  },
  [Network.DEVNET]: {
    name: Network.DEVNET,
    server: NetworkServer.DEVNET,
    description_key: 'TEXT_NETWORK_DESCRIPTION_DEVNET'
  },
  [Network.AMM_DEVNET]: {
    name: Network.AMM_DEVNET,
    server: NetworkServer.AMM_DEVNET,
    description_key: 'TEXT_NETWORK_DESCRIPTION_AMM_DEVNET'
  }
};

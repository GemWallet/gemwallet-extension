export enum Network {
  MAINNET = 'Mainnet',
  TESTNET = 'Testnet',
  DEVNET = 'Devnet',
  NFT_DEVNET = 'NFTDevnet'
}

export enum NetworkServer {
  MAINNET = 'wss://xrplcluster.com',
  TESTNET = 'wss://s.altnet.rippletest.net:51233',
  DEVNET = 'wss://s.devnet.rippletest.net:51233',
  NFT_DEVNET = 'wss://xls20-sandbox.rippletest.net:51233'
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
  [Network.NFT_DEVNET]: {
    name: Network.NFT_DEVNET,
    server: NetworkServer.NFT_DEVNET,
    description: 'A preview of the XLS-20d standard for non-fungible tokens on the XRP Ledger.'
  }
};

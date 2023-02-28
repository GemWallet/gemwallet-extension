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

export interface NetworkInfo {
  name: Network;
  server: NetworkServer;
  description: String;
}

export const Networks = new Map<Network, NetworkInfo>([
  [
    Network.MAINNET,
    {
      name: Network.MAINNET,
      server: NetworkServer.MAINNET,
      description: 'Main network using the production version of the XRP Ledger.'
    }
  ],
  [
    Network.TESTNET,
    {
      name: Network.TESTNET,
      server: NetworkServer.TESTNET,
      description:
        'Acts as a testing network, without impacting production users and risking real money.'
    }
  ],
  [
    Network.DEVNET,
    {
      name: Network.DEVNET,
      server: NetworkServer.DEVNET,
      description: 'A preview of upcoming features, where unstable changes are tested out.'
    }
  ],
  [
    Network.AMM_DEVNET,
    {
      name: Network.AMM_DEVNET,
      server: NetworkServer.AMM_DEVNET,
      description: 'XLS-30d Automated Market Makers preview network.'
    }
  ]
]);

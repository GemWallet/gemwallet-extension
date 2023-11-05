export enum Chain {
  XRPL = 'XRPL',
  XAHAU = 'XAHAU'
}

export enum XRPLNetwork {
  MAINNET = 'Mainnet',
  TESTNET = 'Testnet',
  DEVNET = 'Devnet',
  CUSTOM = 'Custom'
}

export enum XahauNetwork {
  XAHAU_TESTNET = 'Xahau-Testnet',
  CUSTOM = 'Custom'
}

export const MAINNET_CLIO_NODES = ['wss://s1.ripple.com', 'wss://s2.ripple.com'];
export const MAINNET_NODES = ['wss://xrplcluster.com', ...MAINNET_CLIO_NODES];
export const TESTNET_NODES = ['wss://s.altnet.rippletest.net:51233', 'wss://testnet.xrpl-labs.com'];
export const DEVNET_NODES = ['wss://s.devnet.rippletest.net:51233'];
export const XAHAU_TESTNET_NODES = ['wss://hooks-testnet-v3.xrpl-labs.com'];

// Faucets
export const FAUCET_XAHAU_TESTNET = 'https://xahau-test.net/accounts';

export type Network = XRPLNetwork | XahauNetwork;

export interface NetworkNode {
  chain: Chain;
  name: Network;
  server: string;
  nodes?: string[];
  description: string;
}

interface NetworkConfigXRPL {
  [XRPLNetwork.MAINNET]: NetworkNode;
  [XRPLNetwork.TESTNET]: NetworkNode;
  [XRPLNetwork.DEVNET]: NetworkNode;
  [XRPLNetwork.CUSTOM]: NetworkNode;
}

interface NetworkConfigXahau {
  [XahauNetwork.XAHAU_TESTNET]: NetworkNode;
  [XahauNetwork.CUSTOM]: NetworkNode;
}

type ChainConfig = {
  [Chain.XRPL]: NetworkConfigXRPL;
  [Chain.XAHAU]: NetworkConfigXahau;
};

export const NETWORK: ChainConfig = {
  [Chain.XRPL]: {
    [XRPLNetwork.MAINNET]: {
      chain: Chain.XRPL,
      name: XRPLNetwork.MAINNET,
      server: MAINNET_NODES[0],
      nodes: MAINNET_NODES,
      description: 'Main network using the production version of the XRP Ledger.'
    },
    [XRPLNetwork.TESTNET]: {
      chain: Chain.XRPL,
      name: XRPLNetwork.TESTNET,
      server: TESTNET_NODES[0],
      nodes: TESTNET_NODES,
      description:
        'Acts as a testing network, without impacting production users and risking real money.'
    },
    [XRPLNetwork.DEVNET]: {
      chain: Chain.XRPL,
      name: XRPLNetwork.DEVNET,
      server: DEVNET_NODES[0],
      nodes: DEVNET_NODES,
      description: 'A preview of upcoming features, where unstable changes are tested out.'
    },
    [XRPLNetwork.CUSTOM]: {
      chain: Chain.XRPL,
      name: XRPLNetwork.CUSTOM,
      server: '',
      description: 'Custom network configuration provided by the user.'
    }
  },
  [Chain.XAHAU]: {
    [XahauNetwork.XAHAU_TESTNET]: {
      chain: Chain.XAHAU,
      name: XahauNetwork.XAHAU_TESTNET,
      server: XAHAU_TESTNET_NODES[0],
      nodes: XAHAU_TESTNET_NODES,
      description: 'Xahau Testnet for the Xahau blockchain.'
    },
    [XahauNetwork.CUSTOM]: {
      chain: Chain.XAHAU,
      name: XahauNetwork.CUSTOM,
      server: '',
      description: 'Custom network configuration provided by the user.'
    }
  }
};

export const getDefaultNetwork = (chain: Chain): Network => {
  switch (chain) {
    case Chain.XAHAU:
      return XahauNetwork.XAHAU_TESTNET;
    default:
      return XRPLNetwork.MAINNET;
  }
};

export function getNetwork(chain: Chain, network: Network): NetworkNode {
  if (chain === Chain.XRPL && Object.values(XRPLNetwork).includes(network as XRPLNetwork)) {
    return NETWORK[chain][network as XRPLNetwork] as NetworkNode;
  }

  if (chain === Chain.XAHAU && Object.values(XahauNetwork).includes(network as XahauNetwork)) {
    return NETWORK[chain][network as XahauNetwork] as NetworkNode;
  }

  throw new Error(`Network ${network} is not valid for chain ${chain}`);
}

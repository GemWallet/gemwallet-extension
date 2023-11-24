import { xrpToDrops } from 'xrpl';

export enum Chain {
  XRPL = 'XRPL'
}

export enum XRPLNetwork {
  MAINNET = 'Mainnet',
  TESTNET = 'Testnet',
  DEVNET = 'Devnet',
  AMM_DEVNET = 'AMM-Devnet',
  CUSTOM = 'Custom'
}

export const Networks = {
  [Chain.XRPL]: [
    XRPLNetwork.MAINNET,
    XRPLNetwork.TESTNET,
    XRPLNetwork.DEVNET,
    XRPLNetwork.AMM_DEVNET
  ]
};

export const MAINNET_CLIO_NODES = ['wss://s1.ripple.com', 'wss://s2.ripple.com'];
export const MAINNET_NODES = ['wss://xrplcluster.com', ...MAINNET_CLIO_NODES];
export const TESTNET_NODES = ['wss://s.altnet.rippletest.net:51233', 'wss://testnet.xrpl-labs.com'];
export const DEVNET_NODES = ['wss://s.devnet.rippletest.net:51233'];
export const AMM_DEVNET_NODES = ['wss://amm.devnet.rippletest.net:51233'];

export type Network = XRPLNetwork;

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
  [XRPLNetwork.AMM_DEVNET]: NetworkNode;
  [XRPLNetwork.CUSTOM]: NetworkNode;
}

type ChainConfig = {
  [Chain.XRPL]: NetworkConfigXRPL;
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
    [XRPLNetwork.AMM_DEVNET]: {
      chain: Chain.XRPL,
      name: XRPLNetwork.AMM_DEVNET,
      server: AMM_DEVNET_NODES[0],
      nodes: AMM_DEVNET_NODES,
      description: 'XLS-30d Automated Market Makers preview network.'
    },
    [XRPLNetwork.CUSTOM]: {
      chain: Chain.XRPL,
      name: XRPLNetwork.CUSTOM,
      server: '',
      description: 'Custom network configuration provided by the user.'
    }
  }
};

export const getDefaultNetwork = (chain: Chain): Network => {
  switch (chain) {
    default:
      return XRPLNetwork.MAINNET;
  }
};

export function getNetwork(chain: Chain, network: Network): NetworkNode {
  if (chain === Chain.XRPL && Object.values(XRPLNetwork).includes(network as XRPLNetwork)) {
    return NETWORK[chain][network as XRPLNetwork] as NetworkNode;
  }

  throw new Error(`Network ${network} is not valid for chain ${chain}`);
}

export const getMaxFeeInDrops = (chain: Chain): number => {
  switch (chain) {
    default:
      return Number(xrpToDrops(1));
  }
};

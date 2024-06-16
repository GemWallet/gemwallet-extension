import {
  Chain,
  getDefaultNetwork,
  getNetwork,
  Network,
  NetworkNode,
  XRPLNetwork
} from '@gemwallet/constants';
import { NetworkData } from '@gemwallet/constants/src/network/network.types';

import { STORAGE_CUSTOM_NETWORKS, STORAGE_NETWORK } from '../constants/storage';

import { loadData, removeData, saveData } from '.';

export const saveNetwork = (
  chain: Chain,
  network: Network,
  customNetworkName?: string,
  customNetworkServer?: string
) => {
  if (customNetworkName && customNetworkServer) {
    saveData(
      STORAGE_NETWORK,
      JSON.stringify({ chain, name: customNetworkName, server: customNetworkServer })
    );
  } else {
    saveData(
      STORAGE_NETWORK,
      JSON.stringify({ chain, name: network, server: getNetwork(chain, network).server })
    );
  }
};

export const loadCustomNetworks = (): Record<string, NetworkData> => {
  const data = loadData(STORAGE_CUSTOM_NETWORKS);
  if (data) {
    return JSON.parse(data);
  }
  return {};
};

export const replaceCustomNetworks = (networks: Record<string, NetworkData>) => {
  saveData(STORAGE_CUSTOM_NETWORKS, JSON.stringify(networks));
};

export const saveCustomNetwork = (networkData: NetworkData) => {
  // Read existing custom networks from storage
  const existingCustomNetworks = loadCustomNetworks();

  // Add new custom network to existing custom networks
  existingCustomNetworks[networkData.name] = networkData;

  // Save custom networks to storage
  replaceCustomNetworks(existingCustomNetworks);
};

export const loadNetwork = () => {
  try {
    const data = loadData(STORAGE_NETWORK);
    if (!data) {
      return getNetwork(Chain.XRPL, getDefaultNetwork(Chain.XRPL));
    }

    const parsedData: NetworkNode = JSON.parse(data);
    try {
      return getNetwork(parsedData.chain as Chain, parsedData.name as Network);
    } catch (error) {
      /* empty */
    }

    if ('chain' in parsedData && 'name' in parsedData && 'server' in parsedData) {
      return {
        chain: parsedData.chain,
        name: 'Custom' as Network,
        customNetworkName: parsedData.name,
        server: parsedData.server,
        description: 'Custom network'
      };
    }
  } catch (error) {
    /* empty */
  }

  return getNetwork(Chain.XRPL, XRPLNetwork.MAINNET);
};

export const removeNetwork = () => {
  return Promise.resolve()
    .then(() => {
      removeData(STORAGE_NETWORK);
    })
    .catch((error) => {
      throw error;
    });
};

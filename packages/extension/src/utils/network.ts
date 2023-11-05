import { Chain, getNetwork, Network, NetworkNode, XRPLNetwork } from '@gemwallet/constants';
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
    try {
      saveData(
        STORAGE_NETWORK,
        JSON.stringify({ chain, name: customNetworkName, server: customNetworkServer })
      );
    } catch (e) {
      throw e;
    }
  } else {
    try {
      saveData(
        STORAGE_NETWORK,
        JSON.stringify({ chain, name: network, server: getNetwork(chain, network).server })
      );
    } catch (e) {
      throw e;
    }
  }
};

export const loadCustomNetworks = (): Record<string, NetworkData> => {
  try {
    const data = loadData(STORAGE_CUSTOM_NETWORKS);
    if (data) {
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    throw error;
  }
};

export const replaceCustomNetworks = (networks: Record<string, any>) => {
  try {
    saveData(STORAGE_CUSTOM_NETWORKS, JSON.stringify(networks));
  } catch (error) {
    throw error;
  }
};

export const saveCustomNetwork = (networkData: NetworkData) => {
  try {
    // Read existing custom networks from storage
    let existingCustomNetworks = loadCustomNetworks();

    // Add new custom network to existing custom networks
    existingCustomNetworks[networkData.name] = networkData;

    // Save custom networks to storage
    replaceCustomNetworks(existingCustomNetworks);
  } catch (e) {
    throw e;
  }
};

export const loadNetwork = () => {
  try {
    const data = loadData(STORAGE_NETWORK);
    if (!data) {
      return getNetwork(Chain.XRPL, XRPLNetwork.MAINNET);
    }

    const parsedData: NetworkNode = JSON.parse(data);
    try {
      return getNetwork(parsedData.chain as Chain, parsedData.name as Network);
    } catch (error) {}

    if ('chain' in parsedData && 'name' in parsedData && 'server' in parsedData) {
      return {
        chain: parsedData.chain,
        name: parsedData.name,
        server: parsedData.server,
        description: 'Custom network'
      };
    }
  } catch (error) {}

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

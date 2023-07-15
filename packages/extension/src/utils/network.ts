import { NETWORK, Network } from '@gemwallet/constants';

import { STORAGE_CUSTOM_NETWORKS, STORAGE_NETWORK } from '../constants/localStorage';

import { loadData, removeData, saveData } from '.';

export const saveNetwork = (network: Network) => {
  try {
    saveData(STORAGE_NETWORK, network);
  } catch (e) {
    throw e;
  }
};

export const loadCustomNetworks = (): Record<
  string,
  { name: string; server: string; description?: string }
> => {
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

export const saveCustomNetwork = (networkData: {
  name: string;
  server: string;
  description?: string;
}) => {
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
    if (data && NETWORK[data as Network]) {
      return NETWORK[data as Network];
    }
    return NETWORK[Network.MAINNET];
  } catch (error) {
    return NETWORK[Network.MAINNET];
  }
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

import { NETWORK, Network } from '@gemwallet/constants';

import { STORAGE_CUSTOM_NETWORKS, STORAGE_NETWORK } from '../constants/localStorage';

import { loadData, removeData, saveData } from '.';

export const saveNetwork = (
  network: Network,
  customNetworkName?: string,
  customNetworkServer?: string
) => {
  if (customNetworkName && customNetworkServer) {
    try {
      saveData(
        STORAGE_NETWORK,
        JSON.stringify({ name: customNetworkName, server: customNetworkServer })
      );
    } catch (e) {
      throw e;
    }
  } else {
    try {
      saveData(STORAGE_NETWORK, JSON.stringify({ name: network, server: NETWORK[network].server }));
    } catch (e) {
      throw e;
    }
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
    if (!data) {
      return NETWORK[Network.MAINNET];
    }

    const parsedData = JSON.parse(data);
    if (NETWORK[parsedData.name as Network]) {
      return NETWORK[parsedData.name as Network];
    }

    return {
      name: parsedData.name,
      server: parsedData.server
    };
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

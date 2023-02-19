import { Network, Networks, NetworkInfo } from '@gemwallet/constants';

import { STORAGE_NETWORK } from '../constants/localStorage';

import { loadData, removeData, saveData } from '.';

export const saveNetwork = (network: Network) => {
  try {
    saveData(STORAGE_NETWORK, network);
  } catch (e) {
    throw e;
  }
};

function getNetworkInfoOrThrows(network: Network): NetworkInfo {
  const value = Networks.get(network);
  if (!value) {
    throw new Error('Unable to find Network with value ' + network);
  }
  return value;
}

export const loadNetwork = (network?: Network): NetworkInfo => {
  try {
    if (network) {
      return getNetworkInfoOrThrows(network);
    }
    const data = loadData(STORAGE_NETWORK);
    if (data && getNetworkInfoOrThrows(data as Network)) {
      return getNetworkInfoOrThrows(data as Network);
    }
    return getNetworkInfoOrThrows(Network.MAINNET);
  } catch (error) {
    return getNetworkInfoOrThrows(Network.MAINNET);
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

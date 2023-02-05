import { NETWORK, Network } from '@gemwallet/constants';

import { STORAGE_NETWORK } from '../constants/localStorage';

import { loadData, removeData, saveData } from '.';

export const saveNetwork = (network: Network) => {
  try {
    saveData(STORAGE_NETWORK, network);
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

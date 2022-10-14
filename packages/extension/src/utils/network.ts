import { STORAGE_NETWORK } from '../constants/localStorage';
import { loadData, removeData, saveData } from '.';
import { NETWORK } from '../constants';
import { Network } from '../types';

export const saveNetwork = (network: Network) => {
  try {
    saveData(STORAGE_NETWORK, network);
  } catch (e) {
    throw e;
  }
};

export const loadNetwork = () => {
  const data = loadData(STORAGE_NETWORK);
  if (data) {
    return NETWORK[data as Network];
  }
  return NETWORK[Network.MAINNET];
};

export const removeNetwork = () => {
  return Promise.resolve().then(() => {
    removeData(STORAGE_NETWORK);
  });
};

import { NETWORK, Network } from '@gemwallet/constants';

import { saveNetwork, loadNetwork, removeNetwork } from './network';
import { STORAGE_NETWORK } from '../constants';

// Mock the localStorage object and its methods
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  length: 0,
  clear: jest.fn(),
  key: jest.fn()
};

beforeEach(() => {
  jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => localStorageMock);
});

afterEach(() => {
  // Reset the mock after each test
  localStorageMock.getItem.mockReset();
  localStorageMock.setItem.mockReset();
  localStorageMock.removeItem.mockReset();
});

describe('saveNetwork', () => {
  test('should save the network to local storage', () => {
    const network = Network.MAINNET;
    saveNetwork(network);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_NETWORK,
      JSON.stringify({
        name: network,
        server: NETWORK[network].server
      })
    );
  });

  test('should throw an error if saving to local storage fails', () => {
    const error = new Error('Error saving to local storage');
    localStorage.setItem = jest.fn(() => {
      throw error;
    });
    expect(() => saveNetwork(Network.MAINNET)).toThrowError(error);
  });
});

describe('loadNetwork', () => {
  test('should load the network from local storage', () => {
    localStorage.getItem = jest.fn(() => Network.MAINNET);
    expect(loadNetwork()).toEqual(NETWORK[Network.MAINNET]);
  });

  test('should return the mainnet network if no network is found in local storage', () => {
    localStorage.getItem = jest.fn(() => null);
    expect(loadNetwork()).toEqual(NETWORK[Network.MAINNET]);
  });

  test('should return the mainnet network if an error occurs while loading the network', () => {
    const error = new Error('Error loading network from local storage');
    localStorageMock.getItem = jest.fn(() => {
      throw error;
    });
    expect(loadNetwork()).toEqual(NETWORK[Network.MAINNET]);
  });
});

describe('removeNetwork', () => {
  test('should remove the network from local storage', async () => {
    await removeNetwork();
    expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_NETWORK);
  });

  test('should catch errors and throw them', async () => {
    const error = new Error('error');
    localStorageMock.removeItem.mockImplementation(() => {
      throw error;
    });

    try {
      await removeNetwork();
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(e).toBe(error);
    }
  });
});

import { Chain, getNetwork, XRPLNetwork } from '@gemwallet/constants';

import { STORAGE_NETWORK } from '../constants';
import { loadNetwork, removeNetwork, saveNetwork } from './network';

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
    const chain = Chain.XRPL;
    const network = XRPLNetwork.MAINNET;
    saveNetwork(chain, network);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_NETWORK,
      JSON.stringify({
        chain: chain,
        name: network,
        server: getNetwork(chain, network).server
      })
    );
  });

  test('should throw an error if saving to local storage fails', () => {
    const error = new Error('Error saving to local storage');
    localStorage.setItem = jest.fn(() => {
      throw error;
    });
    expect(() => saveNetwork(Chain.XRPL, XRPLNetwork.MAINNET)).toThrowError(error);
  });
});

describe('loadNetwork', () => {
  test('should load the network from local storage', () => {
    localStorage.getItem = jest.fn(() => XRPLNetwork.MAINNET);
    expect(loadNetwork()).toEqual(getNetwork(Chain.XRPL, XRPLNetwork.MAINNET));
  });

  test('should return the mainnet network if no network is found in local storage', () => {
    localStorage.getItem = jest.fn(() => null);
    expect(loadNetwork()).toEqual(getNetwork(Chain.XRPL, XRPLNetwork.MAINNET));
  });

  test('should return the mainnet network if an error occurs while loading the network', () => {
    const error = new Error('Error loading network from local storage');
    localStorageMock.getItem = jest.fn(() => {
      throw error;
    });
    expect(loadNetwork()).toEqual(getNetwork(Chain.XRPL, XRPLNetwork.MAINNET));
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

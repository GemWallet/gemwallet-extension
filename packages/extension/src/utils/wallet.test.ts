import { STORAGE_SELECTED_WALLET, STORAGE_WALLETS } from '../constants';
import { encrypt } from './crypto';
import {
  loadSelectedWallet,
  loadWallets,
  removeWallets,
  saveSelectedWallet,
  saveWallet
} from './wallet';
import { describe, test, vi, beforeEach, afterEach } from 'vitest';

// Mock the localStorage object and its methods
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  clear: vi.fn(),
  key: vi.fn()
};

const password = 'password';
const wallet = {
  name: 'Wallet 1',
  publicAddress: 'rdDjZgJnFa1JMtQtTNZVUAkE6EXrUkmuL',
  seed: 'spoVYVKVDaWYZERvh3xSgQPTu2X13'
};

beforeEach(() => {
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => localStorageMock);
});

afterEach(() => {
  // Reset the mock after each test
  localStorageMock.getItem.mockReset();
  localStorageMock.setItem.mockReset();
  localStorageMock.removeItem.mockReset();
});

describe('saveWallet', () => {
  test.skip('should save the wallet to local storage', () => {
    saveWallet(wallet, password);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      STORAGE_WALLETS,
      encrypt(JSON.stringify([wallet]), password)
    );
  });

  test.skip('should add a default name to the wallet if none is provided', () => {
    const walletWithoutName = {
      ...wallet,
      name: undefined
    };
    saveWallet(walletWithoutName, password);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      STORAGE_WALLETS,
      encrypt(JSON.stringify([wallet]), password)
    );
  });

  test('should throw an error if saving to local storage fails', () => {
    const error = new Error('Error saving to local storage');
    localStorageMock.setItem = vi.fn(() => {
      throw error;
    });
    expect(() => saveWallet(wallet, password)).toThrowError(error);
  });
});

describe('loadWallets', () => {
  test('should load the wallets from local storage', () => {
    localStorageMock.getItem = vi.fn(() => encrypt(JSON.stringify([wallet]), password));
    expect(loadWallets(password)).toEqual([wallet]);
  });

  test('should return an empty array if no wallets are found in local storage', () => {
    localStorageMock.getItem = vi.fn(() => null);
    expect(loadWallets(password)).toEqual([]);
  });

  test('should return an empty array if an error occurs while loading the wallets', () => {
    const error = new Error('Error loading wallets from local storage');
    localStorageMock.getItem = vi.fn(() => {
      throw error;
    });
    expect(loadWallets(password)).toEqual([]);
  });

  test('should return an empty array if the password is incorrect', () => {
    const wrongPassword = 'wrongPassword';
    localStorageMock.getItem = vi.fn(() => encrypt(JSON.stringify([wallet]), password));
    expect(loadWallets(wrongPassword)).toEqual([]);
  });
});

describe('removeWallets', () => {
  test('should remove the wallets from local storage', async () => {
    await removeWallets();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_WALLETS);
  });
});

describe('saveSelectedWallet', () => {
  test('should save the selected wallet index to local storage', () => {
    const index = 2;
    saveSelectedWallet(index);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      STORAGE_SELECTED_WALLET,
      JSON.stringify(index)
    );
  });

  test('should throw an error if saving to local storage fails', () => {
    const error = new Error('Error saving to local storage');
    localStorageMock.setItem = vi.fn(() => {
      throw error;
    });
    expect(() => saveSelectedWallet(2)).toThrowError(error);
  });
});

describe('loadSelectedWallet', () => {
  test('should load the selected wallet index from local storage', () => {
    localStorageMock.getItem = vi.fn(() => JSON.stringify(2));
    expect(loadSelectedWallet()).toEqual(2);
  });

  test('should return 0 if no selected wallet index is found in local storage', () => {
    localStorageMock.getItem = vi.fn(() => null);
    expect(loadSelectedWallet()).toEqual(0);
  });

  test('should return 0 if an error occurs while loading the selected wallet index', () => {
    const error = new Error('Error loading selected wallet index from local storage');
    localStorageMock.getItem = vi.fn(() => {
      throw error;
    });
    expect(loadSelectedWallet()).toEqual(0);
  });
});

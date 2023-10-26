import { loadData } from './storageLocal';
import {
  checkPermissions,
  loadTrustedApps,
  Permission,
  removeTrustedApp,
  removeWalletFromTrustedApp,
  saveTrustedApp,
  TrustedApp
} from './trustedApps';
import { STORAGE_TRUSTED_APPS } from '../constants';

describe('Trusted Apps util', () => {
  const mockTrustedApp: TrustedApp = {
    url: 'https://example.com',
    permissions: [Permission.Address]
  };

  beforeEach(() => {
    // Clear the local storage before each test
    localStorage.clear();
  });

  describe('checkPermissions', () => {
    test('should return true if all the permissions required are included within the trustedApp', () => {
      const trustedApp = {
        url: 'https://gemwallet.app',
        permissions: [Permission.Address, Permission.PublicKey]
      };
      const permissions = [Permission.Address, Permission.PublicKey];
      expect(checkPermissions(trustedApp, permissions)).toBeTruthy();
    });

    test('should return true if the permission required is included within the trustedApp', () => {
      const trustedApp = {
        url: 'https://gemwallet.app',
        permissions: [Permission.Address, Permission.PublicKey]
      };
      const permissions = [Permission.Address];
      expect(checkPermissions(trustedApp, permissions)).toBeTruthy();
    });

    test('should return false if all the permissions required are not included within the trustedApp', () => {
      const trustedApp = {
        url: 'https://gemwallet.app',
        permissions: [Permission.Address]
      };
      const permissions = [Permission.Address, Permission.PublicKey];
      expect(checkPermissions(trustedApp, permissions)).toBeFalsy();
    });
  });

  describe('saveTrustedApp', () => {
    test('should save the trusted app in local storage if none already exists', () => {
      saveTrustedApp(mockTrustedApp, 0);
      const trustedApps = JSON.parse(loadData(STORAGE_TRUSTED_APPS) || '[[]]');
      expect(trustedApps[0]).toContainEqual(mockTrustedApp);
    });

    test('should update the trusted app if it already exists', () => {
      saveTrustedApp(mockTrustedApp, 0);
      const updatedTrustedApp = {
        url: mockTrustedApp.url,
        permissions: [Permission.PublicKey]
      };
      saveTrustedApp(updatedTrustedApp, 0);
      const trustedApps = JSON.parse(loadData(STORAGE_TRUSTED_APPS) || '[[]]');
      expect(trustedApps[0]).toContainEqual({
        url: mockTrustedApp.url,
        permissions: [Permission.Address, Permission.PublicKey]
      });
    });

    test('should save the trusted app if one already exists', () => {
      saveTrustedApp(mockTrustedApp, 0);
      const mockTrustedApp2 = {
        url: 'https://example2.com',
        permissions: [Permission.PublicKey]
      };
      saveTrustedApp(mockTrustedApp2, 0);
      const trustedApps = JSON.parse(loadData(STORAGE_TRUSTED_APPS) || '[[]]');
      expect(trustedApps).toContainEqual([mockTrustedApp, mockTrustedApp2]);
    });

    // test('should throw error if saving trusted app to local storage fails', () => {
    //   jest.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
    //     throw new Error('Error saving trusted app to local storage');
    //   });

    //   expect(() => saveTrustedApp(mockTrustedApp, 0)).toThrowError(
    //     'Error saving trusted app to local storage'
    //   );
    // });
  });

  describe('loadTrustedApps', () => {
    test('should return an empty array if there are no trusted apps in local storage', () => {
      expect(loadTrustedApps(0)).toEqual([]);
    });

    test('should return the trusted apps for the given wallet index', () => {
      saveTrustedApp(mockTrustedApp, 0);
      expect(loadTrustedApps(0)).toContainEqual(mockTrustedApp);
    });

    test('should return an empty array if the wallet index is invalid', () => {
      expect(loadTrustedApps(1)).toEqual([]);
    });
  });

  describe('removeTrustedApp', () => {
    test('should remove the trusted app from local storage and return the updated list of trusted apps', () => {
      saveTrustedApp(mockTrustedApp, 0);
      const updatedTrustedApps = removeTrustedApp(mockTrustedApp.url, 0);
      const trustedApps = JSON.parse(loadData(STORAGE_TRUSTED_APPS) || '[[]]');
      expect(trustedApps[0]).not.toContainEqual(mockTrustedApp);
      expect(updatedTrustedApps).not.toContainEqual(mockTrustedApp);
    });

    test('should clear local storage if there are no other trusted apps', () => {
      saveTrustedApp(mockTrustedApp, 0);
      removeTrustedApp(mockTrustedApp.url, 0);
      expect(localStorage.getItem('trustedApps')).toBeNull();
    });

    test('should throw an error if the wallet index is invalid', () => {
      expect(() => removeTrustedApp(mockTrustedApp.url, 1)).toThrowError(
        "Couldn't find the wallet while removing the trusted app"
      );
    });
  });

  describe('removeWalletFromTrustedApp', () => {
    test('should remove the wallet and its trusted apps from local storage', () => {
      saveTrustedApp(mockTrustedApp, 0);
      removeWalletFromTrustedApp(0);
      const trustedApps = JSON.parse(loadData(STORAGE_TRUSTED_APPS) || '[[]]');
      expect(trustedApps).toEqual([]);
    });

    test('should do nothing if the wallet index is invalid', () => {
      saveTrustedApp(mockTrustedApp, 0);
      removeWalletFromTrustedApp(1);
      const trustedApps = JSON.parse(loadData(STORAGE_TRUSTED_APPS) || '[[]]');
      expect(trustedApps[0]).toContainEqual(mockTrustedApp);
    });
  });
});

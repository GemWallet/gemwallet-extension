import { checkPermissions, Permission } from './trustedApps';

describe('Trusted Apps util', () => {
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
});

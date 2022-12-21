import { encrypt, decrypt } from './crypto';

const message = 'My secret message';
// deepcode ignore NoHardcodedPasswords/test: This password is used only for unit-testing
const passwordTest = 'mypassword123';

describe('Crypto util', () => {
  describe('encrypt and decrypt workflows', () => {
    test('should successfully encrypt and decrypt the message', () => {
      const encryptedMessage = encrypt(message, passwordTest);
      const decryptedMessage = decrypt(encryptedMessage, passwordTest);

      expect(decryptedMessage).toEqual(message);
    });

    test('should not decrypt the message', () => {
      const encryptedMessage = encrypt(message, passwordTest);
      const decryptedMessage = decrypt(encryptedMessage, `${passwordTest}wrong`);

      expect(decryptedMessage).toBeUndefined();
    });
  });
});

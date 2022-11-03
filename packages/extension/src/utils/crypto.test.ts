import { encrypt, decrypt } from './crypto';

const MESSAGE = 'My secret message';
const PASSWORD = 'mypassword123';

describe('Crypto util', () => {
  describe('encrypt and decrypt workflows', () => {
    test('should successfully encrypt and decrypt the message', () => {
      const encryptedMessage = encrypt(MESSAGE, PASSWORD);
      const decryptedMessage = decrypt(encryptedMessage, PASSWORD);

      expect(decryptedMessage).toEqual(MESSAGE);
    });

    test('should not decrypt the message', () => {
      const encryptedMessage = encrypt(MESSAGE, PASSWORD);
      const decryptedMessage = decrypt(encryptedMessage, `${PASSWORD}wrong`);

      expect(decryptedMessage).toBeUndefined();
    });
  });
});

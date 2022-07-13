import { encrypt, decrypt } from '.';

describe('Crypto util', () => {
  describe('encrypt and decrypt workflows', () => {
    test('should successfully encrypt and decrypt the message', () => {
      const message = 'My secret messsage';
      const password = 'mypassword123';

      const encryptedMessage = encrypt(message, password);
      const decryptedMessage = decrypt(encryptedMessage, password);

      expect(decryptedMessage).toEqual(message);
    });

    test('should not decrypt the message', () => {
      const message = 'My secret messsage';
      const password = 'mypassword123';

      const encryptedMessage = encrypt(message, password);
      const decryptedMessage = decrypt(encryptedMessage, `${password}wrong`);

      expect(decryptedMessage).toEqual('');
    });
  });
});

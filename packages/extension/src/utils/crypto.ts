import * as CryptoJS from 'crypto-js';

export const encrypt = (message: string, key: string) => {
  return CryptoJS.AES.encrypt(message, key).toString();
};

export const decrypt = (cipherText: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  try {
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return undefined;
  }
};

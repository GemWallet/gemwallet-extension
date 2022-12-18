import * as CryptoJS from 'crypto-js';

export const encrypt = (message: string, key: string): string => {
  return CryptoJS.AES.encrypt(message, key).toString();
};

export const decrypt = (cipherText: string, key: string): string | undefined => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return undefined;
  }
};

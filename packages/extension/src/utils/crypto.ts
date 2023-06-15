import * as CryptoJS from 'crypto-js';

export const encrypt = (message: string, key: string): string => {
  return CryptoJS.AES.encrypt(message, key).toString();
};

export const decrypt = (cipherText: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const currencyToHex = (currency: string): string => {
  return Buffer.from(currency).toString('hex').toUpperCase().padEnd(40, '0');
};

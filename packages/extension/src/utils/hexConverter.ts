export const currencyToHex = (currency: string): string => {
  return Buffer.from(currency).toString('hex').toUpperCase().padEnd(40, '0');
};

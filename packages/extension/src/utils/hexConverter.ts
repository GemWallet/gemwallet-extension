export const currencyToHex = (currency: string): string => {
  return Buffer.from(currency).toString('hex').toUpperCase().padEnd(40, '0');
};

export const hexToCurrency = (hex: string): string => {
  // Trim trailing zeros in the hex string
  hex = hex.toLowerCase().replace(/0+$/, '');

  // Convert hex to Buffer and then to ASCII
  return Buffer.from(hex, 'hex').toString('ascii');
};
